# SortLab — Sorting Algorithm Visualizer

An interactive web application that visualizes how classical sorting algorithms compare, swap, and rearrange data — one step at a time. Built as a DAA (Design and Analysis of Algorithms) lab project to make abstract time-complexity differences visually observable.

**Live Demo:** https://kishorereddycse860-hub.github.io/DAA_PROJECT/
---

## Problem Statement

Design and implement a web-based application that visualizes the working of classical sorting algorithms through step-by-step, interactive animation — enabling clearer understanding of comparison and swap behaviour, and making abstract time-complexity differences visually observable.

---

## Author

| | |
|---|---|
| **Submitted By** | Kishore Reddy Gayam |
| **Guided By** | nixan raj pamba |
| **Subject** | Design and Analysis of Algorithms (DAA) |
| **Institution** | Marwadi University, Dept. of CSE (AI/ML) |
| **GitHub** | [@kishorereddycse860-hub](https://github.com/kishorereddycse860-hub) |
| **LinkedIn** | [kishore-reddy-gayam](https://linkedin.com/in/kishore-reddy-gayam-867254316) |

---

## Features

- **6 sorting algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
- **Step-by-step animation** with color-coded states (comparing, swapping, pivot/reference, sorted)
- **Playback controls**: Play, Pause, Step Forward, Step Backward, Reset
- **Manual array input** — enter your own numbers instead of a random array
- **Adjustable array size and animation speed**
- **Live stats**: comparison count, swap/write count, current step
- **Live console log** — every comparison, swap, and write printed in real time
- **Algorithm detail pages** — description, how-it-works steps, pseudocode, and time/space complexity for each algorithm

---

## Pages

| Page | Description |
|---|---|
| `index.html` | Cover page — problem statement, author, faculty, subject |
| `algorithms.html` | Grid of all 6 sorting algorithms |
| `algorithm.html?algo=<name>` | Details for one algorithm (description, pseudocode, complexity) |
| `visualizer.html?algo=<name>` | Interactive step-by-step visualizer |

---

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (no frameworks, no build step)
- Hosted on GitHub Pages

---

## Project Structure

```
sorting-visualizer-DAA/
├── index.html
├── algorithms.html
├── algorithm.html
├── visualizer.html
└── assets/
    ├── style.css
    ├── data.js
    └── sorter.js
```

---

## Complexity Reference

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

---

## Running Locally

No installation needed — just open `index.html` in any browser. To run it as a proper local server (optional, avoids any relative-path issues):

```bash
# Python 3
python -m http.server 8000

# then open http://localhost:8000
```

---

## License

This project was built for academic/educational purposes as part of a DAA lab assignment.
