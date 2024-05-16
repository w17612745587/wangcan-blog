# 2.4 const限定符

在C++中，`const`是一个非常有用的关键字，用于定义常量和指定不可修改的变量。例如，用一个变量来表示缓冲区的大小。使用变量的好处是当我们觉得缓冲区大小不再合适时，很容易对其进行调整。另一方面，也应随时警惕防止程序一不小心改变了这个值。为了满足这一要求，可以用关键字const对变量的类型加以限定：
```cpp
const int bufSize = 512
```

## 常量的定义
使用`const`关键字可以定义常量，即在程序执行期间不可修改的值。例如，我们可以这样定义一个整数常量：
```cpp
const int i = get_size(); //正确:运行时初始化
const int j = 42; //正确:编译时初始化
const int k; //错误:k是一个未经初始化的常量
```
::: tip
默认状态下，const对象仅在文件内有效。也就是说在多个文件中定义同名的const变量时等同于在不同文件中分别定义了独立变量.

如果想在多个文件之间共享const对象,必须在变量的定义之前添加extern关键字。:
```cpp
//file 1.cc 定义并初始化了一个常量，该常量能被其他文件访问
extern const int bufsize = fen()

//file 1.h 头文件
extern const int bufsize://与file 1.ce中定义的 bufsize是同一个
```
:::
## const引用
### 初始化和对const的引用
引用的类型必须与其所引用对象的类型一致，但是有两个外。第一种例外情况就是在初始化常量引用时允许用任意表达式作为初始值，只要该表式的结果能转换成引用的类型即可。尤其，允许为一个常量用绑定非常量的对象、字面值，甚至是个一般表达式：
```cpp
int i=42;
const int &rl = i; //允许将 const int &绑定到一个普通 int 对象上
const int &r2 = 42; //正确:r1是一个常量引用
const int &r3 = r1*2;//正确:r3是一个常量引用
int &r4=rl* 2; //错误:r4是一个普通的非常量引用
```
绑定不同类型的特殊情况：
```cpp
double dval = 3.14;
const int &ri = dval;
```
以上代码会被编译器变成以下形式：
```cpp
double dval = 3.14;
const int temp = dval; //由双精度浮点数生成一个临时整形变量
const int &ri = dval;
```
::: tip
从以上代码也可以理解了为什么给不同类型的非const引用绑定C++会视为非法，即改变ri的值的时候改变的是temp的值而不是dval，这不符合我们的期望。
:::
### 对const的引用可能引用一个并非const的对象
常量引用仅对引用可参与的操作做出了限定，对于引用的对象本身是不是一个常量未作限定。因为对象也可能是个非常量，所以允许通过其他途径改变它的值:
```cpp
int i = 42; 
int &r1 = i;  //引用r1绑定对象i
const int &r2 = i;  //r2也绑定对象i，但是不允许通过r2 修改i的值
r1 = 0; //r1并非常量，i的值修改为 0
r2 = 0; //错误: r2是一个常量引用
```

const还可以用于声明函数形参的常量引用，这在函数参数传递和避免不必要的拷贝时非常有用。例如：

```cpp
void printArray(const vector<int>& arr) {
    // arr[0] = 10;  // 错误！不可修改的引用
    for (const auto& num : arr) {
        cout << num << " ";
    }
    cout << endl;
}
```
在上述代码中，arr被声明为一个常量引用，确保在函数内部不会修改传递的数组。

## 指针和const
与引用一样，也可以令指针指向常量或非常量。类似于常量引用指向常量的指针(pointertoconst)不能用于改变其所指对象的值。要想存放常量对象的地址，只能使用指向常量的指针
```cpp
const double pi = 3.14;
double *ptr = &pi; //错误：ptr是一个普通指针
const double *cptr = &pi; //正确：cptr可以指向一个双精度常量
*cptr = 42; //错误：不能给cptr赋值
double dval = 3.14;
cptr = &dval; //正确: 指针的类型必须与其所指对象的类型一致，但是有两个例外。第一种例外情况是允许令一个指向常量的指针指向一个非常量对象
```
### const指针
请注意以下写法的区别
```cpp
int dval = 1;
const int *p1 = &dval; //指向常量的指针不允许修改dval的值
int const *p2 = &dval; //同上一行的写法等价
int *const p3 = &dval; //常量指针，不允许改变指针的指向
const int *const p4 = &dval; //指向常量的常量指针，既不允许改变指针的指向也不允许改变dval的值
```
如何来区别这个指针到底是常量指针还是指向常量的指针呢，技巧是观察const是在*左边还是右边。当const在*右边时，它是常量指针，当const在*左边时，它是指向常量的指针。


常量指针必须初始化，一旦初始化完成，则它的值（也就是存放在指针中的那个地址)就不能再改变了


::: tip
值得一体的是，本文提到过的引用其实是常量指针的语法糖。编译器会把引用编译成常量指针的样子。这也可以理解了为什么引用必须要在定义时候初始化。所以以下引用和指针的的用法是等价的.
```cpp
double pi = 3.14;
double &r1 = pi; 
double *const p1 = &pi; //等价于上一行 
const double &r2 = pi;
const double *const p2 = &pi; //等价于上一行 
```
:::

### 顶层const
* 顶层const是指const修饰的是指针或变量本身，而不是指针或变量所指向的对象。顶层const表示被修饰的对象本身是一个常量，不能被修改。

    例如，下面的代码中的const int就是一个顶层const：

    ```cpp
    复制
    const int num = 10;
    ```
    在这个例子中，num是一个顶层const的变量，它被声明为一个常量整数，其值不能被修改。

    另一个例子是指针的顶层const：
    ```cpp
    int value = 5;
    int* const ptr = &value;
    ```
    在这个例子中，ptr是一个顶层const的指针，它被声明为一个指向整数的常量指针，指针的值（即指向的地址）不能被修改，但可以通过指针来修改所指向的对象的值。

* 底层const是指const修饰的是指针或引用所指向的对象，而不是指针或引用本身。底层const表示被修饰的对象是一个常量，不能通过该指针或引用来修改其值。

    例如，下面的代码中的const int*就是一个底层const：
    ```cpp
    int value = 10;
    const int* ptr = &value;
    ```
    在这个例子中，ptr是一个底层const的指针，它被声明为一个指向整数的指针，但指针所指向的对象是一个常量，不能通过该指针来修改其值。

    另一个例子是引用的底层const：
    ```cpp
    int value = 5;
    const int& ref = value;
    ```
    在这个例子中，ref是一个底层const的引用，它被声明为一个指向整数的常量引用，引用所绑定的对象是一个常量，不能通过该引用来修改其值。

## const成员函数
在类中，可以将成员函数声明为const，以指示该函数不会修改对象的状态。这样的成员函数称为常量成员函数。例如：

```cpp
class Circle {
public:
    double getArea() const {
        // radius = 10;  // 错误！常量成员函数不能修改对象的成员变量
        return 3.14 * radius * radius;
    }

private:
    double radius;
}
```
在上述代码中，getArea()函数被声明为一个常量成员函数，因此不能修改Circle对象的radius成员变量。

## constexpr和常量表达式
**常量表达式**(const expression)_是指值不会改变并且在编译过程就能得到计算结果的表达式_。显然，字面值属于常量表达式，用常量表达式初始化的const对象也是常量表达式。后面将会提到，C++语言中有几种情况下是要用到常量表达式的。
-个对象(或表达式)是不是常量表达式由它的数据类型和初始值共同决定，例如:
```cpp
const int max_files = 20; //max_files是常量表达式
const int limit = max_files+1;// limit是常量表达式
int staff_size = 27; //staff_size 不是常量表达式
const int sz = get_size(); //sz不是常量表达式
```
尽管 staff_size 的初始值是个字面值常量，但由于它的数据类型只是一个普通int 而非const int，所以它不属于常量表达式。另一方面，尽管sz本身是一个常量，但它的具体值直到运行时才能获取到，所以也不是常量表达式。
### constexpr变量
C++新特性允许将变量声明为constexpr，以便来由编译器验证变量的值是否是一个表达式。声明为常量的变量一定是一个常量，而且必须用常量表达式初始化：
```cpp
constexpr int mf = 20; // 20是常量表达式
constexpr int limit = mf + 1; //mf + 1是常量表达式
constexpr int sz= size(); //只有当size是一个constexpr函数时才是一条正确的声明语句
```

### 指针和constexpr
在constexpr声明中如果定义了一个指针，限定符constexpr仅对指针有效，与指针所指的对象无关:
```cpp
const int *p = nullptr; //P是一个指向整型常量的指针
constexpr int *q = nullptr; //q是一个指向整数的常量指针
```


## 总结
const是C++中一个重要的关键字，用于定义常量、指定不可修改的变量、声明常量引用以及定义常量成员函数。通过合理使用const，我们可以增加代码的可读性、安全性和性能。

Happy coding!