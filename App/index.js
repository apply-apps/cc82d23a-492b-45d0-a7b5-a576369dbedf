// Filename: index.js
import React, { useRef, useEffect } from 'react';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import { PerspectiveCamera, Scene, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { View, Button, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function App() {
  const cameraRef = useRef();
  let cube;

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    cube = new Mesh(geometry, material);
    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  };

  const moveForward = () => {
    const camera = cameraRef.current;
    camera.position.z -= 0.1;
  };

  const moveBackward = () => {
    const camera = cameraRef.current;
    camera.position.z += 0.1;
  };

  return (
    <SafeAreaView style={styles.container}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={moveForward}>
          <Button title="Forward" onPress={moveForward} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={moveBackward}>
          <Button title="Backward" onPress={moveBackward} />
        </TouchableOpacity>
      </View>
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
  glView: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  button: {
    margin: 10,
  },
});