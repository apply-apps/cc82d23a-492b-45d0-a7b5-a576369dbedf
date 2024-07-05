// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert } from 'react-native';

// Snake Component
const Snake = ({ snake }) => {
  return (
    <View>
      {snake.map((segment, index) => (
        <View key={index} style={[styles.snake, { top: segment.y * 20, left: segment.x * 20 }]} />
      ))}
    </View>
  );
};

// Food Component
const Food = ({ position }) => {
  return <View style={[styles.food, { top: position.y * 20, left: position.x * 20 }]} />;
};

const BOARD_SIZE = 10;
const INITIAL_SNAKE = [{ x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }];

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      const snakeHead = { ...snake[0] };

      switch (direction) {
        case 'UP':
          snakeHead.y -= 1;
          break;
        case 'DOWN':
          snakeHead.y += 1;
          break;
        case 'LEFT':
          snakeHead.x -= 1;
          break;
        case 'RIGHT':
          snakeHead.x += 1;
          break;
        default:
          break;
      }

      if (
        snakeHead.x >= BOARD_SIZE ||
        snakeHead.y >= BOARD_SIZE ||
        snakeHead.x < 0 ||
        snakeHead.y < 0 ||
        snake.some(segment => segment.x === snakeHead.x && segment.y === snakeHead.y)
      ) {
        setGameOver(true);
        Alert.alert('Game Over', 'You crashed!');
        return;
      }

      const newSnake = [snakeHead, ...snake];

      if (snakeHead.x === food.x && snakeHead.y === food.y) {
        setFood(getRandomPosition());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, 300);
    return () => clearInterval(intervalId);
  }, [snake, direction, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.board}>
        <Snake snake={snake} />
        <Food position={food} />
      </View>
      <Button title="Restart Game" onPress={restartGame} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  board: {
    width: BOARD_SIZE * 20,
    height: BOARD_SIZE * 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  snake: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'green',
  },
  food: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
  },
});