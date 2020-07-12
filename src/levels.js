window.LEVELS = {};
window.LEVEL_TIMES = {};

// 98
window.LEVELS[1] = `
#include <iostream>
using namespace std;
<br>
int main() {
  cout << "Hello World!";
  return 0;
}`;
window.LEVEL_TIMES[1] = 60 * 1000;

// 281
window.LEVELS[2] = `
#include <iostream>
using namespace std;
<br>
struct Test {
  int data;
  Test() { cout << "Test::Test()" << endl; }
  ~Test() { cout << "Test::~Test()" << endl; }
};
<br>
int main() {
  Test *ptr = (Test *)malloc(sizeof(Test));
  new (ptr) Test;
  ptr->~Test();
  free(ptr);
  return 0;
}`
window.LEVEL_TIMES[2] = 75 * 1000;

window.LEVELS[3] = `
#include <map>
<br>
template <int (*f)(int)>
int memoize(int x) {
  static std::map<int, int> cache;
  std::map<int, int>::iterator y = cache.find(x);
  if (y != cache.end()) return y->second;
  return cache[x] = f(x);
}
<br>
int fib(int n) {
  if (n < 2) return n;
  return memoize<fib>(n - 1) + memoize<fib>(n - 2);
}`
window.LEVEL_TIMES[3] = 90 * 1000;

// 369
window.LEVELS[3] = `
string someWordFunction(Node* head, int k) {
  string ans = "";
  int cnt = 0;
  string word = "";
<br>
  while (head) {
    if (cnt == k) {
      if (ans != "") {
          ans = ans + " ";
      }
<br>
      ans = ans + word;
      word = "";
    }
    word = word + string(1, head->data);
    cnt++;
    head = head->next;
  }
<br>
  return ans;
}`
window.LEVEL_TIMES[3] = 100 * 1000;

// 449
window.LEVELS[4] = `
#include <iostream>
using namespace std;
<br>
struct Test {
  int num;
  void func() {}
};
<br>
int Test::*ptr_num = &Test::num;
void (Test::*ptr_func)() = &Test::func;
<br>
int main() {
  Test t;
  Test *pt = new Test;
<br>
  (t.*ptr_func)();
  (pt->*ptr_func)();
<br>
  t.*ptr_num = 1;
  pt->*ptr_num = 2;
<br>
  delete pt;
  return 0;
}`
window.LEVEL_TIMES[4] = 125 * 1000;

// 472
window.LEVELS[5] = `
struct Event { virtual ~Event() {} };
struct MouseEvent : Event { int x, y; };
struct KeyboardEvent : Event { int key; };
<br>
void log(Event *event) {
  if (MouseEvent *mouse = dynamic_cast<MouseEvent *>(event))
    std::cout << "MouseEvent " << mouse->x << " " << mouse->y << std::endl;
  else if (KeyboardEvent *keyboard = dynamic_cast<KeyboardEvent *>(event))
    std::cout << "KeyboardEvent " << keyboard->key << std::endl;
  else
    std::cout << "Event" << std::endl;
}`
window.LEVEL_TIMES[5] = 150 * 1000;

