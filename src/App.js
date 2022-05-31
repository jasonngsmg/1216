import { useState } from "react";
import "./App.scss";
import GridRow from "./Components/GridRow";

const App = () => {
    const emptyTile = 0;
    const tile1 = 1;
    const tile2 = 2;
    const scoredTile1 = 11;
    const scoredTile2 = 12;

    const nextGridMap = [
        [2, 1],
        [1, 2],
    ];

    const miniGridMap = [
        [0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const gridMap = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 2, 2, 0, 0],
        [2, 2, 0, 2, 2, 2, 0, 0],
        [1, 1, 1, 2, 2, 1, 1, 0],
        [1, 1, 2, 2, 1, 1, 1, 0],
        [1, 1, 2, 2, 1, 1, 1, 10],
    ];

    const [matrixA] = useState(miniGridMap);
    const [matrixB, setMatrixB] = useState(gridMap);
    const [matrixC] = useState(nextGridMap);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [scoredAreaSize, setScoredAreaSize] = useState([]);

    const CheckMiniGridMap = (matrix) => {
        let row = [];

        matrix.forEach((e, y) => {
            let miniGridData = [];
            e.forEach((data, x) => {
                data !== 0 && miniGridData.push([data, [x, y]]);
            });
            row.push(miniGridData);
        });
        return row;
    };

    const ArrangeTile = (value) => {
        let j = 0;
        let row = 0;

        for (let i = 0; i < value.length; i++) {
            row = value[i].length;

            if (j === row) {
                break;
            }

            while (j < row) {
                let temp_tile = [];

                for (let k = 0; k < value.length; k++) {
                    if (value[k][j] !== emptyTile) {
                        temp_tile.push(value[k][j]);
                        value[k][j] = 0;
                    }
                }

                temp_tile.reverse();

                for (let x = 0; x < temp_tile.length; x++) {
                    value[value.length - 1 - x][j] = temp_tile[x];
                }

                j += 1;
            }
        }
    };

    const CheckLinkedTile = (matrix, tile, scoredTile, linkedTile) => {
        for (let i = 0; i < matrix.length - 1; i++) {
            for (let j = 0; j < matrix[i].length - 1; j++) {
                if (
                    (matrix[i][j] === tile || matrix[i][j] === scoredTile) &&
                    (matrix[i][j + 1] === tile ||
                        matrix[i][j + 1] === scoredTile) &&
                    (matrix[i + 1][j] === tile ||
                        matrix[i + 1][j] === scoredTile) &&
                    (matrix[i + 1][j + 1] === tile ||
                        matrix[i + 1][j + 1] === scoredTile)
                ) {
                    linkedTile.push([
                        [i, j],
                        [i, j + 1],
                        [i + 1, j],
                        [i + 1, j + 1],
                    ]);
                }
            }
        }
    };

    const CheckScoredArea = (linkedTile, scoredArea, type) => {
        let visitedNode = [];

        linkedTile.forEach((elem) => {
            let calculateScoredTile = 0;
            elem.forEach((data) => {
                if (!visitedNode.includes(data.toString()) && type === 1) {
                    visitedNode.push(data.toString());
                    scoredArea.push(data);
                } else if (
                    !visitedNode.includes(data.toString()) &&
                    type === 2
                ) {
                    visitedNode.push(data.toString());
                    calculateScoredTile += 1;
                }
            });

            if (type === 2) {
                scoredArea.push(calculateScoredTile);
            }
        });
    };

    // const CheckCalculateScoredArea = (linkedTile, tempScoredAreaSize) => {
    //     let visitedNode = [];
    //     let tempScoredAreaSize = [];

    //     linkedTile.forEach((elem) => {
    //         let calculateScoredTile = 0;
    //         elem.forEach((data) => {
    //             if (!visitedNode.includes(data.toString())) {
    //                 visitedNode.push(data.toString());
    //                 calculateScoredTile += 1;
    //             }
    //         });
    //         tempScoredAreaSize.push(calculateScoredTile);
    //     });
    // };

    const calculateScoredAreaSize = () => {
        let linkedTile = [];
        let scoredArea = [];
        let calculateScoredTileArea = 4;

        CheckScoredArea(linkedTile, scoredArea, 2);

        console.log(linkedTile);
        console.log(scoredArea);

        for (let i = 0; i < scoredArea.length; i++) {
            if (scoredArea[i + 1] !== 4 && i !== scoredArea.length - 1) {
                calculateScoredTileArea =
                    calculateScoredTileArea + scoredArea[i + 1];
            } else if (scoredArea[i + 1] === 4 && i !== scoredArea.length - 1) {
                scoredAreaSize.push(calculateScoredTileArea);
                calculateScoredTileArea = 4;
            } else if (i === scoredArea.length - 1) {
                scoredAreaSize.push(calculateScoredTileArea);
            }
        }
    };

    const TransformTile = (matrix, tile, scoredTile) => {
        let linkedTile = [];
        let scoredArea = [];

        CheckLinkedTile(matrix, tile, scoredTile, linkedTile);
        CheckScoredArea(linkedTile, scoredArea, 1);

        for (let k = 0; k < scoredArea.length; k++) {
            matrix[scoredArea[k][0]][scoredArea[k][1]] = scoredTile;
        }
    };

    TransformTile(matrixB, tile1, scoredTile1);
    TransformTile(matrixB, tile2, scoredTile2);

    const ResetGame = () => {
        setMatrixB(gridMap);
    };

    const DropTile = () => {
        const tempMiniGridMap = CheckMiniGridMap(matrixA);
        let tempMatrix = matrixB;
        let reduceY = 0;

        if (tempMiniGridMap[0].length === 0) {
            reduceY = 1;
        }

        tempMiniGridMap.forEach((elem) => {
            elem.forEach((item) => {
                const data = item[0];
                const x = item[1][0];
                const y = item[1][1] - reduceY;

                tempMatrix[y][x] === 0
                    ? (tempMatrix[y][x] = data)
                    : setGameOver(true);
            });
        });

        gameOver === true && console.log("Game Over");

        setMatrixB([...tempMatrix]);
        ArrangeTile(matrixB);
    };

    const PullLever = () => {
        let tempMatrix = matrixB;

        calculateScoredAreaSize();

        tempMatrix.forEach((elem, i) => {
            elem.forEach((data, j) => {
                if (data === scoredTile1 || data === scoredTile2) {
                    tempMatrix[i][j] = emptyTile;
                }
            });
        });

        let tempScore = score;
        scoredAreaSize.forEach((elem) => {
            tempScore = tempScore + elem ** 2;
        });
        setScore(tempScore);
        setScoredAreaSize([]);
        setMatrixB([...tempMatrix]);
        ArrangeTile(matrixB);
    };

    return (
        <div className="body">
            <div className="justify-content-center">
                <div className="grid">
                    <div className="no-border mb-1">
                        {matrixA.map((e, i) => (
                            <GridRow key={i} data={e} display={false} />
                        ))}
                    </div>
                    {matrixB.map((e, i) => (
                        <GridRow key={i} data={e} display={false} />
                    ))}
                </div>

                <div className="grid">
                    <div className="mb-1">
                        {matrixA.map((e, i) => (
                            <GridRow key={i} data={e} display={true} />
                        ))}
                    </div>

                    {matrixB.map((e, i) => (
                        <GridRow key={i} data={e} display={true} />
                    ))}
                </div>

                <div>
                    <div className="mb-3">Score:&nbsp;{score}</div>
                    <div className="mb-3">
                        <div>Next:</div>
                        <div className="next-grid no-border">
                            {matrixC.map((e, i) => (
                                <GridRow key={i} data={e} display={false} />
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <button onClick={DropTile}>Drop it</button>
                    </div>

                    <div className="mb-3">
                        <button onClick={PullLever}>Lever</button>
                    </div>

                    <div>
                        <button onClick={ResetGame}>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
