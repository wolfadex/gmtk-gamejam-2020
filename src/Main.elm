module Main exposing (main)


import Browser exposing (Document)
import Html exposing (Html)
import Html.Attributes as Attrs
import Html.Events as Events
import Json.Decode exposing (Decoder)
import Random exposing (Seed)


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , subscriptions = \_ -> Sub.none
        , update = update
        , view = view
        }


type alias Model =
    { currentWord : String
    , pastWords : List String
    , history : List String
    , currentInput : String
    , seed : Seed
    }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        ( firstWord, initSeed ) =
            getWord (Random.initialSeed 0)
    in
    ( { currentWord = firstWord
      , pastWords = []
      , history = []
      , currentInput = ""
      , seed = initSeed
      }
    , Cmd.none
    )



getWord : Seed -> ( String, Seed )
getWord seed =
    let
        ( firstWord, restOfWords ) =
            words
    in
    Random.step
        (Random.uniform firstWord restOfWords)
        seed


words : ( String, List String )
words =
    ( "word"
    , [ "hack"
      , "system"
      , "file"
      , "computer"
      ]
    )


type Msg
    = NoOp
    | SetInput String
    | SendCommand
    | PreviousCommand
    | NextCommand


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        SetInput nextInput ->
            ( { model | currentInput = nextInput }, Cmd.none )

        SendCommand ->
            if model.currentInput == model.currentWord then
                let
                    ( nextWord, nextSeed ) =
                        getWord model.seed
                in
                ( { model
                    | currentInput = ""
                    , currentWord = nextWord
                    , pastWords = model.currentWord :: model.pastWords
                    , seed = nextSeed
                    , history = model.currentInput :: model.history
                  }
                , Cmd.none
                )

            else
                ( { model
                    | currentInput = ""
                    , history = model.currentInput :: model.history
                  }
                , Cmd.none
                )

        PreviousCommand ->
            case model.history of
                next :: rest ->
                    ( { model
                        | currentInput = next
                        , history = rest
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        NextCommand ->
            Debug.todo "Handle reverse history navigation"



view : Model -> Document Msg
view model =
    { title = "Ctrl"
    , body =
        [ model.pastWords
            |> List.reverse
            |> List.map (\word -> Html.li [] [ prompt word ])
            |> Html.ul [ Attrs.class "previous-commands"]
        , prompt model.currentWord
        , prompt ""
        , Html.input
            [ Attrs.type_ "text"
            , Attrs.autofocus True
            , Attrs.value model.currentInput
            , Events.onInput SetInput
            , Events.on "keypress" terminalKeyPress
            ]
            []
        ]
    }


terminalKeyPress : Decoder Msg
terminalKeyPress =
    Json.Decode.field "key" Json.Decode.string
        |> Json.Decode.andThen
            (\key ->
                Json.Decode.succeed <|
                    case key of
                        "ArrowUp" ->
                            PreviousCommand

                        "Enter" ->
                            SendCommand

                        _ ->
                            NoOp
            )


prompt : String -> Html msg
prompt str =
    Html.text ("$> " ++ str)