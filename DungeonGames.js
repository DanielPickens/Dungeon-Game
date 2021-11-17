 //We can initiate a 2D array and we can let dp represent the min health the knight needs to reach the end from a specific square
// And we can then predict the amount the health that the knight should end on after he has saved the princess.
//By evaluating the position of the knight If the princess is located at 'm - 1, n - 1'
// and essientially if the knight continues to move right or down
//Then the The knight's hp at 'm - 1, n' or 'm, n - 1' should be equal to 1
//We can make this approach using Recursion starting from the top left
//Where, in each of the recursive calls
	// We need to traverse by moving down or to the right.
// We will choose a path for the knight that gives us the least amount of hp
//where we can finally find the min health the knight needs to reach the end from a specific square
/

tc: O(n^2)
sc: O(n)

var calculateMinimumHP = (dungeon) => {
    const v = dungeon.length - 1, m = dungeon[0].length - 1;
    const dp = new Array(v + 1).fill(0).map(() => new Array(m + 1).fill(0));

    // base case
    // let dp represent the min health the knight needs to reach the end from a specific square
    dp[v][m] = dungeon[v][m] <= 0 ? -dungeon[v][m] + 1 : 1;
    for (let i = 1; i <= v; i++) {
        dp[v-i][m] = Math.max(1, dp[v-i+1][m] - dungeon[v-i][m]);
    }
    for (let i = 1; i <= m; i++) {
        dp[v][m-i] = Math.max(1, dp[v][m-i+1] - dungeon[v][m-i]);
    }
    
	// recurrence
    for (let i = 1; i <= v; i++) {
        for (let j = 1; j <= m; j++) {
            const fromRight = Math.max(1, dp[v-i][m-j+1] - dungeon[v-i][m-j]);
            const fromDown = Math.max(1, dp[v-i+1][m-j] - dungeon[v-i][m-j]);
            dp[v-i][m-j] = Math.min(fromDown, fromRight);
        }
    }
    
    return dp[0][0];
};






Solution 2: Dijkstra's algo:
//We can solve this also by using a DFS with a reqular stack and we wouldn't neccesarily arrive to the solution with a faster runtime. However,
// We will use Disjktra' algorithm  to increase the speed of the search while making sure optimality it is guaranteed;
//We  can use Dijkstra over the minimum accumulative HP to find a path towards the princess
// and we want to also save the parents along the way, so we could reconstruct the route
//And, once we get to the destination, we can trace back and find the mininum accumulative HP along the way to induce the HP needed at the beginning of the trip
// We can then initialize a distance matrix.
 // The idea is that we will use the said distance matrix to trace the parent so we can reconstruct the path leading to the destination.


tc: O(nlogn)
sc: O(n)


var calculateMinimumHP = (dungeon) => {
   
    const rows = dungeon.length, colNum = dungeon[0].length;
    const distance = Array.from({length: rows}, () => Array(colNum).fill(Infinity));
    const prev = Array.from({length: rows}, () => Array(colNum).fill(null));

    distance[0][0] = dungeon[0][0] * -1;
    prev[0][0] = 'R'
    
    const queue = [[0, 0, distance[0][0]]];
    
    while(queue.length) {
        queue.sort((a, b) => a[2] - b[2]);
        const [r, c, dist] = queue.shift();
        if(dist > distance[r][c]) continue;
        
        if(r === rows-1 && c === colNum-1) return backtrace();
        
        if(r+1 < rows) {
            const lookDist = distance[r][c] + dungeon[r+1][c] * -1;
            if(lookDist < distance[r+1][c]) {
                distance[r+1][c] = lookDist;
                prev[r+1][c] = 'D';
                queue.push([r+1, c, lookDist]);
            }
        }
        
        if(c+1 < colNum) {
            const newDist = distance[r][c] + dungeon[r][c+1] * -1;
            if(newDist < distance[r][c+1]) {
                distance[r][c+1] = newDist;
                prev[r][c+1] = 'R';
                queue.push([r, c+1, newDist]);
            }
        }
    }
    
    function backtrace() {
        let dist = 1, 
            row = rows-1,
            col = colNum-1,
            firstCell = prev[row][col],
            dunCell = dungeon[row][col];
        
        while(firstCell) {
            if(dunCell < 0) dist += dunCell * -1;
            else dist -= dunCell;
            
            if(dist <= 0) dist = 1;
            
            if(firstCell === 'D') row--;
            else col--;
            
            firstCell = prev[row][col];
            dunCell = dungeon[row][col];
        }
        return dist;
    }
};
