const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const VALID_DIRECTIONS = ['N', 'E', 'S', 'W']
const VALID_MOVES = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0]
}

function validatePlateauSize (line) {
  const [maxX, maxY] = line?.trim()?.split(' ')?.map(Number)
  if (isNaN(maxX) || isNaN(maxY) || maxX <= 0 || maxY <= 0) {
    throw new Error(`===========> Invalid Input! Invalid Plateau Size: ${line}`)
  }
  return { maxX, maxY }
}

function validatePosition (line, plateau) {
  const [rawX, rawY, dir, power] = line?.trim()?.split(' ')
  const x = parseInt(rawX, 10)
  const y = parseInt(rawY, 10)

  if (isNaN(x) || isNaN(y) || !VALID_DIRECTIONS.includes(dir) || !power) {
    throw new Error('===========> Invalid Input! Invalid Robot Position.')
  }

  if (!isWithinBounds(x, y, plateau)) {
    throw new Error(
      '===========> Invalid Input! Robot Position is outside Plateau.'
    )
  }

  if (power <= 0 || isNaN(power)) {
    throw new Error('===========> No Power')
  }

  return { x, y, dir, power }
}

function validateInstructions (instr) {
  if (!/^[LRMB]+$/.test(instr)) {
    throw new Error(
      '===========> Invalid Input! Movement instructions are invalid.'
    )
  }
}

function isWithinBounds (x, y, plateau) {
  return x >= 0 && y >= 0 && x <= plateau?.maxX && y <= plateau?.maxY
}

function turnLeft (dir) {
  const index = VALID_DIRECTIONS.indexOf(dir)
  return VALID_DIRECTIONS[(index + 3) % 4]
}

function turnRight (dir) {
  const index = VALID_DIRECTIONS.indexOf(dir)
  return VALID_DIRECTIONS[(index + 1) % 4]
}

function moveForward (x, y, dir) {
  const [dx, dy] = VALID_MOVES[dir]
  return [x + dx, y + dy]
}

function moveBackward (x, y, dir) {
  const [dx, dy] = VALID_MOVES[dir]
  return [x - dx, y - dy]
}

function checkPower (initPower, maxPower) {
  if (initPower < maxPower) {
    return true
  }
  return false
}

function executeInstructions (x, y, dir, instructions, plateau, power) {
  // hurles
  let initPower = 0
  const maxPower = power

  for (const cmd of instructions) {
    const allowMove = checkPower(initPower, maxPower)
    if (allowMove) {
      if (cmd === 'L') {
        dir = turnLeft(dir)
      } else if (cmd === 'R') {
        dir = turnRight(dir)
      } else if (cmd === 'M') {
        const [nx, ny] = moveForward(x, y, dir)

        if (!isWithinBounds(nx, ny, plateau)) {
          console.warn(
            `===========> WARNING! Robot tried moving out of plateau at (${nx}, ${ny}). Skipping Command.`
          )
          continue
        }
        x = nx
        y = ny
      } else if (cmd === 'B') {
        const [nx, ny] = moveBackward(x, y, dir)

        if (!isWithinBounds(nx, ny, plateau)) {
          console.warn(
            `===========> WARNING! Robot tried moving out of plateau at (${nx}, ${ny}). Skipping Command.`
          )
          continue
        }
        x = nx
        y = ny
      } else {
        console.warn(
          `===========> Invalid command "${cmd}". Skipping Command..`
        )
      }
      initPower++
    } else {
      console.warn(`===========> OUT OF POWER`)
    }
  }
  return `${x} ${y} ${dir} ${maxPower - initPower}`
}

const eachPlateau = inputLines => {
  try {
    const plateau = validatePlateauSize(inputLines[0])
    const results = []

    for (let i = 1; i < inputLines.length; i += 2) {
      try {
        const positionLine = inputLines[i]
        const instructionLine = inputLines[i + 1]

        const { x, y, dir, power } = validatePosition(positionLine, plateau)
        validateInstructions(instructionLine)

        const result = executeInstructions(
          x,
          y,
          dir,
          instructionLine,
          plateau,
          power
        )
        results.push(result)
      } catch (err) {
        console.error(err.message)
      }
    }

    console.log(
      '\n --------------------- New Robot Coordinates: ----------------------------'
    )
    results.forEach(res => console.log(res))
  } catch (error) {
    console.warn(`===========> ERROR IN PLATEU VALIDATION!`)
  }
}

function divideArray (array, element) {
  return array.reduce((acc, curr) => {
    if (curr === element) {
      acc.push([])
    } else {
      if (acc.length === 0) {
        acc.push([curr])
      } else {
        acc[acc.length - 1].push(curr)
      }
    }
    return acc
  }, [])
}

const inputLines = []
console.log(
  '--------------------- ENTER INPUT (press Ctrl+D once done) ----------------------------'
)

rl.on('line', line => {
  inputLines.push(line.trim())
})

rl.on('close', () => {
  try {
    if (inputLines.length < 3 || inputLines.length % 2 === 0) {
      throw new Error('===========> Invalid Input! Please Recheck.')
    }

    const totalPlateus = divideArray(inputLines, '')

    for (const currP of totalPlateus) {
      eachPlateau(currP)
    }
  } catch (err) {
    console.error(`===========> ERROR! ${err.message || 'Unknown Error'}`)
  }
})
