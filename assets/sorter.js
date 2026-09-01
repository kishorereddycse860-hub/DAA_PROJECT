/* =========================================================
   SortLab — step recorder
   Runs each algorithm once and records every comparison,
   swap, overwrite, pivot-mark, and sorted-mark as a step,
   so the visualizer can play forward AND backward through
   the exact same recorded history.
   ========================================================= */

function recordSortSteps(inputArr, algo){
  const a = inputArr.slice();
  const steps = [];

  function compare(i, j){ steps.push({ type:'compare', i, j }); }
  function swap(i, j){
    steps.push({ type:'swap', i, j });
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  function overwrite(i, value){
    steps.push({ type:'overwrite', i, value });
    a[i] = value;
  }
  function markSorted(i){ steps.push({ type:'sorted', i }); }
  function markPivot(i){ steps.push({ type:'pivot', i }); }

  if (algo === 'bubble'){
    const n = a.length;
    for (let i=0;i<n-1;i++){
      for (let j=0;j<n-1-i;j++){
        compare(j, j+1);
        if (a[j] > a[j+1]) swap(j, j+1);
      }
      markSorted(n-1-i);
    }
    markSorted(0);
  }

  else if (algo === 'selection'){
    const n = a.length;
    for (let i=0;i<n-1;i++){
      let minIdx = i;
      markPivot(minIdx);
      for (let j=i+1;j<n;j++){
        compare(minIdx, j);
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) swap(i, minIdx);
      markSorted(i);
    }
    markSorted(n-1);
  }

  else if (algo === 'insertion'){
    const n = a.length;
    markSorted(0);
    for (let i=1;i<n;i++){
      let j = i;
      while (j > 0){
        compare(j-1, j);
        if (a[j-1] > a[j]){ swap(j-1, j); j--; }
        else break;
      }
      for (let k=0;k<=i;k++) markSorted(k);
    }
  }

  else if (algo === 'merge'){
    function mergeSort(lo, hi){
      if (hi - lo <= 1) return;
      const mid = Math.floor((lo+hi)/2);
      mergeSort(lo, mid);
      mergeSort(mid, hi);
      const left = a.slice(lo, mid);
      const right = a.slice(mid, hi);
      let i=0, j=0, k=lo;
      while (i < left.length && j < right.length){
        compare(lo+i, mid+j);
        if (left[i] <= right[j]) overwrite(k++, left[i++]);
        else overwrite(k++, right[j++]);
      }
      while (i < left.length) overwrite(k++, left[i++]);
      while (j < right.length) overwrite(k++, right[j++]);
    }
    mergeSort(0, a.length);
    for (let i=0;i<a.length;i++) markSorted(i);
  }

  else if (algo === 'quick'){
    function partition(lo, hi){
      const pivotVal = a[hi];
      markPivot(hi);
      let i = lo - 1;
      for (let j=lo;j<hi;j++){
        compare(j, hi);
        if (a[j] < pivotVal){ i++; if (i!==j) swap(i, j); }
      }
      if (i+1 !== hi) swap(i+1, hi);
      return i+1;
    }
    function quickSort(lo, hi){
      if (lo >= hi){ if (lo === hi) markSorted(lo); return; }
      const p = partition(lo, hi);
      markSorted(p);
      quickSort(lo, p-1);
      quickSort(p+1, hi);
    }
    quickSort(0, a.length-1);
  }

  else if (algo === 'heap'){
    const n = a.length;
    function heapify(size, root){
      let largest = root, l = 2*root+1, r = 2*root+2;
      if (l < size){ compare(l, largest); if (a[l] > a[largest]) largest = l; }
      if (r < size){ compare(r, largest); if (a[r] > a[largest]) largest = r; }
      if (largest !== root){ swap(root, largest); heapify(size, largest); }
    }
    for (let i = Math.floor(n/2)-1; i>=0; i--) heapify(n, i);
    for (let end = n-1; end>0; end--){
      swap(0, end);
      markSorted(end);
      heapify(end, 0);
    }
    markSorted(0);
  }

  return steps;
}

function stepLogLine(step){
  switch(step.type){
    case 'compare':   return { kind:'cmp', tag:'CMP',  text:`comparing arr[${step.i}] and arr[${step.j}]` };
    case 'swap':       return { kind:'swp', tag:'SWP',  text:`swapping arr[${step.i}] and arr[${step.j}]` };
    case 'overwrite':  return { kind:'ovw', tag:'SET',  text:`arr[${step.i}] = ${step.value}` };
    case 'sorted':     return { kind:'srt', tag:'DONE', text:`arr[${step.i}] locked in position` };
    case 'pivot':      return { kind:'piv', tag:'REF',  text:`selecting arr[${step.i}] as reference` };
    default:           return { kind:'',    tag:'',     text:'' };
  }
}
