
#include <bits/stdc++.h>

using namespace std;

void prime_factors(int n)
{
    int arr[n / 2] = {0};
    for (size_t i = 1; i <= n / 2; i++)
    {
        arr[i] = i;
    }
    for (size_t i = 2; i <= n / 2; i++)
    {
        for (size_t j = i * i; j <= n / 2; j += i)
        {
            arr[j] = 0;
        }
    }

    for (size_t i = 2; i <= n / 2; i++)
    {
        if (arr[i] && n % arr[i] == 0)
        {
            cout << arr[i] << " ";
        }
    }
    cout << endl;
}

int main()
{
    int n;
    cin >> n;
    prime_factors(n);
    return 0;
}
