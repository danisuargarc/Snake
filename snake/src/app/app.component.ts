import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Snake';
  currentScore = 0;
  highScore = 0;

  playing = false;
  gameOver = false;
  dinnerServed = false;

  grid: string[][] = [];
  snake: Block[] = [];

  foodX = 18;
  foodY = 18;
  direction = 'right';

  ngOnInit() {
    this.freshGrid();
  }

  async play() {
    this.playing = true;

    while (this.playing) {
      if (!this.dinnerServed) {
        this.freshFood();
        this.dinnerServed = true;

        if (this.snake.length % 5 == 0) {
          this.currentScore += 50;
        }
      }

      await this.delay(300);
      this.move();
    }

    this.gameOver = true;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      alert('New high score!');
    }
  }

  private move() {
    try {
      if (this.snake.length == 1) {
        switch (this.direction) {
          case 'down': {
            this.snake[0].add(1, 0);
            break;
          }
          case 'left': {
            this.snake[0].add(0, -1);
            break;
          }
          case 'up': {
            this.snake[0].add(-1, 0);
            break;
          }
          default: {
            this.snake[0].add(0, 1);
            break;
          }
        }

        if (this.grid[this.snake[0].x][this.snake[0].y] == 'food') {
          this.snake.push(
            new Block(
              this.snake[this.snake.length - 1].oldX,
              this.snake[this.snake.length - 1].oldY,
              'snake'
            )
          );
          this.dinnerServed = false;
          this.currentScore += 100;
        }

        this.updateBlock(this.snake[0].x, this.snake[0].y, 'snake');
        this.updateBlock(this.snake[0].oldX, this.snake[0].oldY, 'black');
      } else {
        for (let x = 0; x < this.snake.length; x++) {
          if (x == 0) {
            switch (this.direction) {
              case 'down': {
                this.snake[0].add(1, 0);
                break;
              }
              case 'left': {
                this.snake[0].add(0, -1);
                break;
              }
              case 'up': {
                this.snake[0].add(-1, 0);
                break;
              }
              default: {
                this.snake[0].add(0, 1);
                break;
              }
            }
            if (this.grid[this.snake[0].x][this.snake[0].y] == 'snake') {
              this.playing = false;
              alert('You ate yourself and lost!');
              return;
            }
          } else {
            this.snake[x].update(
              this.snake[x - 1].oldX,
              this.snake[x - 1].oldY
            );
          }

          if (this.grid[this.snake[0].x][this.snake[0].y] == 'food') {
            this.snake.push(
              new Block(
                this.snake[this.snake.length - 1].oldX,
                this.snake[this.snake.length - 1].oldY,
                'snake'
              )
            );
            this.dinnerServed = false;
            this.currentScore += 100;
          }

          this.updateBlock(this.snake[x].x, this.snake[x].y, 'snake');
          this.updateBlock(this.snake[x].oldX, this.snake[x].oldY, 'black');
        }
      }
    } catch (e: unknown | undefined) {
      this.playing = false;
      alert('You hit the border and lost!');
    }
  }

  private freshGrid() {
    let gridDiv = document.getElementById('gridDiv');

    if (gridDiv != null) {
      for (let x = 0; x < 20; x++) {
        this.grid.push([]);
        gridDiv.innerHTML += '<div>';
        for (let y = 0; y < 20; y++) {
          this.grid[x][y] = 'black';
          gridDiv.innerHTML += `<img id="${x}-${y}" style="margin-left: 2px; margin-right: 2px;" src="../assets/${this.grid[x][y]}.png">`;
        }
        gridDiv.innerHTML += '</div>';
      }
    } else {
      console.log('Something went wrong.');
    }

    this.updateBlock(1, 1, 'snake');
    this.snake.push(new Block(1, 1, 'snake'));
  }

  private freshFood() {
    while (true) {
      this.foodX = Math.floor(Math.random() * 20);
      this.foodY = Math.floor(Math.random() * 20);

      if (
        this.grid[this.foodX][this.foodY] == 'snake' ||
        this.grid[this.foodX][this.foodY] == 'food'
      ) {
        continue;
      } else {
        this.updateBlock(this.foodX, this.foodY, 'food');
        return;
      }
    }
  }

  private updateBlock(x: number, y: number, type: string) {
    let block = document.getElementById(`${x}-${y}`);

    if (block != null) {
      this.grid[x][y] = type;
      block.setAttribute('src', `../assets/${type}.png`);
    } else {
      this.playing = false;
      alert('You hit the border and lost!');
    }
  }

  key(move: string) {
    switch (move) {
      case 'down': {
        if (this.direction == 'up') {
          this.playing = false;
          alert('You broke your neck and lost!');
        } else {
          this.direction = 'down';
        }
        break;
      }
      case 'left': {
        if (this.direction == 'right') {
          this.playing = false;
          alert('You broke your neck and lost!');
        } else {
          this.direction = 'left';
        }
        break;
      }
      case 'up': {
        if (this.direction == 'down') {
          this.playing = false;
          alert('You broke your neck and lost!');
        } else {
          this.direction = 'up';
        }
        break;
      }
      default: {
        if (this.direction == 'left') {
          this.playing = false;
          alert('You broke your neck and lost!');
        } else {
          this.direction = 'right';
        }
        break;
      }
    }
  }

  restart() {
    window.location.reload();
  }

  onKeydown(event: any) {
    console.log(event);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'w': {
        this.key('up');
        break;
      }
      case 'a': {
        this.key('left');
        break;
      }
      case 's': {
        this.key('down');
        break;
      }
      case 'd': {
        this.key('right');
        break;
      }
      default: {
        if (this.gameOver || this.playing) {
          this.restart();
        } else {
          this.play();
        }
        break;
      }
    }
  }
}

class Block {
  x: number = 0;
  y: number = 0;
  oldX: number = 0;
  oldY: number = 0;
  type: string | undefined;

  constructor(x: number, y: number, type: string) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  update(newX: number, newY: number) {
    this.oldX = this.x;
    this.oldY = this.y;
    this.x = newX;
    this.y = newY;
  }

  add(addX: number, addY: number) {
    this.oldX = this.x;
    this.oldY = this.y;
    this.x = this.x + addX;
    this.y = this.y + addY;
  }
}
