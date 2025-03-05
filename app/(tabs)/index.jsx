import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const CIRCLE_RADIUS = 150;
const STROKE_WIDTH = 6;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const App = () => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [startTime, setStartTime] = useState(null);

    const animatedValue = useState(new Animated.Value(0))[0];

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: (1 - animationProgress) * 5000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        setStartTime(Date.now() - elapsedTime * 1000);
    };

    const handlePause = () => {
        setIsRunning(false);
        animatedValue.stopAnimation((currentValue) => {
            setAnimationProgress(currentValue);
        });
        setElapsedTime((prev) => prev + (Date.now() - startTime) / 1000);
    };

    const handleStop = () => {
        setIsRunning(false);
        setTotalTime((prev) => prev + seconds);
        setSeconds(0);
        setElapsedTime(0);
        setAnimationProgress(0);
        animatedValue.setValue(0);
    };

    const progressAnimation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

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
            <Text style={styles.title}>Practice Tracker</Text>
            <View style={styles.timerWrapper}>
                <Svg height="320" width="320" viewBox="0 0 320 320">
                    <Circle
                        cx="160"
                        cy="160"
                        r={CIRCLE_RADIUS}
                        stroke="#D0D0D0"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                    <AnimatedCircle
                        cx="160"
                        cy="160"
                        r={CIRCLE_RADIUS}
                        stroke="#32CD32"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={progressAnimation}
                        strokeLinecap="round"
                        transform="rotate(-90 160 160)"
                    />
                </Svg>
                <Text style={styles.timer}>{formatTime(seconds)}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStart}
                >
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.stopButton}
                    onPress={handleStop}
                >
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.pauseButton}
                    onPress={handlePause}
                >
                    <Text style={styles.buttonText}>Pause</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.totalTimeContainer}>
                <Text style={styles.totalTimeLabel}>Total Time:</Text>
                {totalTime > 0 && (
                    <Text style={styles.totalTime}>
                        {formatTime(totalTime)}
                    </Text>
                )}
            </View>
        </View>
    );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        paddingVertical: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginTop: 100,
    },
    timerWrapper: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    timer: {
        position: "absolute",
        fontSize: 46,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "90%",
        paddingVertical: 20,
    },
    startButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    stopButton: {
        backgroundColor: "#F44336",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    pauseButton: {
        backgroundColor: "#9E9E9E",
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "500",
    },
    totalTimeContainer: {
        alignItems: "center",
        paddingBottom: 40,
    },
    totalTimeLabel: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    totalTime: {
        fontSize: 26,
        color: "#333",
        fontWeight: "500",
    },
});

export default App;