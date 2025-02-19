// Development: Branch: practice-tracker
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const App = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (!isRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
        setTotalTime((prevTotalTime) => prevTotalTime + seconds);
        setSeconds(0);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${
            secs < 10 ? "0" : ""
        }${secs}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Practice Tracker</Text>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Start" onPress={handleStart} />
                <Button title="Stop" onPress={handleStop} />
                <Button title="Reset" onPress={handleReset} />
            </View>
            <Text style={styles.totalTimeLabel}>Total Practice Time:</Text>
            {totalTime > 0 && (
                <Text style={styles.totalTime}>{formatTime(totalTime)}</Text>
            )}
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    text: {
        color: "black",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    timer: {
        fontSize: 48,
        color: "black",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "60%",
    },
    totalTimeLabel: {
        marginTop: 20,
        fontSize: 24,
        color: "black",
    },
    totalTime: {
        fontSize: 24,
        color: "black",
    },
});
