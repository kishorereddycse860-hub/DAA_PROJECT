/* =========================================================
   SortLab — C++ code panel
   Full lab-manual style C++ source for every algorithm
   (class-based, using a temp variable for swaps), plus a
   map from each recorded step type to the line(s) of code
   that step corresponds to — used to drive a PythonTutor
   style "current line" highlight while the animation plays.
   ========================================================= */

const CPP_CODE = {

  bubble:
`#include <iostream>
using namespace std;

class bubblesort
{
public:
    int size;
    int arr[100];
    int i;

    void arrayinput()
    {
        cout << "Enter the size of array" << endl;
        cin >> size;
        cout << "Enter the array elements" << endl;
        for (i = 0; i < size; i++)
        {
            cin >> arr[i];
        }
    }

    void printarray()
    {
        for (i = 0; i < size; i++)
        {
            cout << arr[i] << " ";
        }
        cout << endl;
    }

    void bubblelogic()
    {
        int i, j, temp;
        for (i = 0; i < size - 1; i++)
        {
            for (j = 0; j < size - i - 1; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
};

int main()
{
    bubblesort bs;
    bs.arrayinput();
    cout << "Before sorting" << endl;
    bs.printarray();
    bs.bubblelogic();
    cout << "After sorting" << endl;
    bs.printarray();
    return 0;
}`,

  selection:
`#include <iostream>
using namespace std;

class selectionsort
{
public:
    int size;
    int arr[100];
    int i;

    void arrayinput()
    {
        cout << "Enter the size of array" << endl;
        cin >> size;
        cout << "Enter the array elements" << endl;
        for (i = 0; i < size; i++)
        {
            cin >> arr[i];
        }
    }

    void printarray()
    {
        for (i = 0; i < size; i++)
        {
            cout << arr[i] << " ";
        }
        cout << endl;
    }

    void selectionlogic()
    {
        int i, j, minIndex, temp;
        for (i = 0; i < size - 1; i++)
        {
            minIndex = i;
            for (j = i + 1; j < size; j++)
            {
                if (arr[j] < arr[minIndex])
                {
                    minIndex = j;
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
};

int main()
{
    selectionsort ss;
    ss.arrayinput();
    cout << "Before sorting" << endl;
    ss.printarray();
    ss.selectionlogic();
    cout << "After sorting" << endl;
    ss.printarray();
    return 0;
}`,

  insertion:
`#include <iostream>
using namespace std;

class insertionsort
{
public:
    int size;
    int arr[100];
    int i;

    void arrayinput()
    {
        cout << "Enter the size of array" << endl;
        cin >> size;
        cout << "Enter the array elements" << endl;
        for (i = 0; i < size; i++)
        {
            cin >> arr[i];
        }
    }

    void printarray()
    {
        for (i = 0; i < size; i++)
        {
            cout << arr[i] << " ";
        }
        cout << endl;
    }

    void insertionlogic()
    {
        int i, j, key;
        for (i = 1; i < size; i++)
        {
            key = arr[i];
            j = i - 1;
            while (j >= 0 && arr[j] > key)
            {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
};

int main()
{
    insertionsort is;
    is.arrayinput();
    cout << "Before sorting" << endl;
    is.printarray();
    is.insertionlogic();
    cout << "After sorting" << endl;
    is.printarray();
    return 0;
}`,

  merge:
`#include <iostream>
using namespace std;

class MergeSort
{
public:
    int size;
    int arr[100];

    void arrayInput()
    {
        cout << "Enter the size of array: ";
        cin >> size;
        cout << "Enter the array elements: ";
        for (int i = 0; i < size; i++)
        {
            cin >> arr[i];
        }
    }

    void printArray()
    {
        for (int i = 0; i < size; i++)
        {
            cout << arr[i] << " ";
        }
        cout << endl;
    }

    void merge(int low, int mid, int high)
    {
        int temp[100];
        int i = low, j = mid + 1, k = low;

        while (i <= mid && j <= high)
        {
            if (arr[i] <= arr[j])
            {
                temp[k] = arr[i];
                i++;
            }
            else
            {
                temp[k] = arr[j];
                j++;
            }
            k++;
        }

        while (i <= mid) { temp[k] = arr[i]; i++; k++; }
        while (j <= high) { temp[k] = arr[j]; j++; k++; }

        for (i = low; i <= high; i++)
        {
            arr[i] = temp[i];
        }
    }

    void mergeLogic(int low, int high)
    {
        if (low < high)
        {
            int mid = (low + high) / 2;
            mergeLogic(low, mid);
            mergeLogic(mid + 1, high);
            merge(low, mid, high);
        }
    }
};

int main()
{
    MergeSort ms;
    ms.arrayInput();
    cout << "Before sorting: ";
    ms.printArray();
    ms.mergeLogic(0, ms.size - 1);
    cout << "After sorting: ";
    ms.printArray();
    return 0;
}`,

  quick:
`#include <iostream>
using namespace std;

class QuickSort
{
public:
    int size;
    int arr[100];
    int i;

    void arrayInput()
    {
        cout << "Enter the size of array" << endl;
        cin >> size;
        cout << "Enter the array elements" << endl;
        for (i = 0; i < size; i++)
        {
            cin >> arr[i];
        }
    }

    void printArray()
    {
        for (i = 0; i < size; i++)
        {
            cout << arr[i] << " ";
        }
        cout << endl;
    }

    int partition(int low, int high)
    {
        int pivot = arr[high];
        int i = low - 1;
        int temp;
        for (int j = low; j < high; j++)
        {
            if (arr[j] < pivot)
            {
                i++;
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    void quickLogic(int low, int high)
    {
        if (low < high)
        {
            int pi = partition(low, high);
            quickLogic(low, pi - 1);
            quickLogic(pi + 1, high);
        }
    }
};

int main()
{
    QuickSort qs;
    qs.arrayInput();
    cout << "Before sorting" << endl;
    qs.printArray();
    qs.quickLogic(0, qs.size - 1);
    cout << "After sorting" << endl;
    qs.printArray();
    return 0;
}`,

  heap:
`#include <iostream>
using namespace std;

class heapsort
{
public:
    int size;
    int arr[100];

    void arrayinput()
    {
        cout << "Enter the size of array" << endl;
        cin >> size;
        cout << "Enter the array elements" << endl;
        for (int i = 0; i < size; i++)
        {
            cin >> arr[i];
        }
    }

    void printarray()
    {
        for (int i = 0; i < size; i++)
        {
            cout << arr[i] << " ";
        }
        cout << endl;
    }

    void heapify(int n, int root)
    {
        int largest = root;
        int left = 2 * root + 1;
        int right = 2 * root + 2;
        int temp;

        if (left < n && arr[left] > arr[largest])
            largest = left;

        if (right < n && arr[right] > arr[largest])
            largest = right;

        if (largest != root)
        {
            temp = arr[root];
            arr[root] = arr[largest];
            arr[largest] = temp;
            heapify(n, largest);
        }
    }

    void heapsortlogic()
    {
        int temp;
        for (int i = size / 2 - 1; i >= 0; i--)
            heapify(size, i);

        for (int end = size - 1; end > 0; end--)
        {
            temp = arr[0];
            arr[0] = arr[end];
            arr[end] = temp;
            heapify(end, 0);
        }
    }
};

int main()
{
    heapsort hs;
    hs.arrayinput();
    cout << "Before sorting" << endl;
    hs.printarray();
    hs.heapsortlogic();
    cout << "After sorting" << endl;
    hs.printarray();
    return 0;
}`
};

/* Map: for every step type recorded by sorter.js, which C++ line(s)
   (1-indexed, matching CPP_CODE above) are "currently executing". */
const CPP_LINE_MAP = {
  bubble:     { compare:[38],      swap:[40,41,42],  pivot:[],       sorted:[34],     overwrite:[],  idle:[36] },
  selection:  { compare:[39,41],   swap:[44,45,46],  pivot:[36],     sorted:[34],     overwrite:[],  idle:[37] },
  insertion:  { compare:[38],      swap:[40,41],     pivot:[],       sorted:[34],     overwrite:[],  idle:[38] },
  merge:      { compare:[37],      swap:[],          pivot:[],       sorted:[55],     overwrite:[39,44], idle:[61] },
  quick:      { compare:[38],      swap:[41,42,43,46,47,48], pivot:[33], sorted:[46,47,48], overwrite:[], idle:[36] },
  heap:       { compare:[37,40],   swap:[45,46,47,60,61,62], pivot:[],   sorted:[58],  overwrite:[],  idle:[30] }
};

/* Renders the code panel (called once per algorithm switch) */
function renderCodePanel(container, slug){
  const lines = CPP_CODE[slug].split('\n');
  container.innerHTML = lines.map((line, i) =>
    `<div class="code-line" data-ln="${i+1}"><span class="cln">${String(i+1).padStart(2,'0')}</span><span class="ctext">${escapeCodeHtml(line)}</span></div>`
  ).join('');
}

/* Highlights the line(s) that correspond to the given step type, and
   scrolls the code panel so the active line stays in view. */
function highlightCodeLines(container, slug, stepType){
  const map = CPP_LINE_MAP[slug] || {};
  const activeLines = (stepType && map[stepType] && map[stepType].length) ? map[stepType] : (map.idle || []);
  container.querySelectorAll('.code-line.active').forEach(el => el.classList.remove('active'));
  let firstEl = null;
  activeLines.forEach(ln => {
    const el = container.querySelector(`.code-line[data-ln="${ln}"]`);
    if (el){
      el.classList.add('active');
      if (!firstEl) firstEl = el;
    }
  });
  if (firstEl && container.scrollHeight > container.clientHeight){
    const target = firstEl.offsetTop - container.clientHeight / 2 + firstEl.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }
}

function escapeCodeHtml(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
