# Europa Exploration Mission

A Node.js CLI program to simulate robot movement on a plateau. Robots receive a set of movement instructions and navigate the terrain accordingly.

Prerequisite: You must have Node.js installed in your system!

Instructions to run code-
1. Clone this repo by opening a terminal & entering this command: `git clone https://github.com/pranav043/space-navigator.git`
2. Open Terminal inside the cloned folder & enter command: `node index.js` to execute code.
3. Enter the Input in the specified format (shared below).
4. Press `Ctrl+D` to submit & get result.

Assumptions for this project-
1. All robots must always be inside the Plateau Limits & they can't move otherwise. Any such movement command resulting otherwise will be skipped.
2. More than 1 robot can stay at a single coordinate.
3. Inputs must be correct - all coordinates must be positive integers & movement command must be either of "M", "L" or "R", but still some basic validations are placed.

Example Input (Plateau size (x,y), followed by pairs of Robots initial coordinates & string of commands for that robot)-
```
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
```

Expected Output (Final Coordinates of all Robots)- 
```
1 3 N
5 1 E
```
