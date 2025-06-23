import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSession } from "../../context/SessionContext";

const CIRCLE_RADIUS = 150;
const STROKE_WIDTH = 6;

const OUTLINE_GREY = "#D0D0D0";
const OUTLINE_GREEN = "#32CD32";
const OUTLINE_CYCLE_MS = 5000;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const App: React.FC = () => {
    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [totalTime, setTotalTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [hasSessionStarted, setHasSessionStarted] = useState<boolean>(false);

    const animatedValue = useState(new Animated.Value(0))[0];
    const { addSession } = useSession();

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    const outlineAnim = useState(new Animated.Value(0))[0];
    useEffect(() => {
        if (isRunning || hasSessionStarted) {
            const ms = (seconds % 5) * 1000;
            Animated.timing(outlineAnim, {
                toValue: ms / OUTLINE_CYCLE_MS,
                duration: 250,
                useNativeDriver: false,
            }).start();
        } else {
            outlineAnim.setValue(0);
        }
    }, [seconds, isRunning, hasSessionStarted, outlineAnim]);

    useEffect(() => {
        if (!isRunning && !hasSessionStarted) {
            outlineAnim.setValue(0);
        }
    }, [isRunning, hasSessionStarted, outlineAnim]);

    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
            setHasSessionStarted(true);
            setStartTime(Date.now() - elapsedTime * 1000);
        }
    };

    const handlePause = () => {
        setIsRunning(false);
        if (startTime !== null) {
            setElapsedTime((prev) => prev + (Date.now() - startTime) / 1000);
        }
    };

    const handleStop = () => {
        if (hasSessionStarted && seconds > 0) {
            addSession(seconds);
            setTotalTime((prev) => prev + seconds);
        }
        setIsRunning(false);
        setHasSessionStarted(false);
        setSeconds(0);
        setElapsedTime(0);
        setAnimationProgress(0);
        animatedValue.setValue(0);
    };

    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    const outlineColor = outlineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [OUTLINE_GREY, OUTLINE_GREEN],
    });
    const outlineOpacity = outlineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Music Practice Timer</Text>
            <Text style={styles.description}>
                Track your practice sessions to improve your skills
            </Text>
            <View style={styles.timerWrapper}>
                <Svg height="320" width="320" viewBox="0 0 320 320">
                    <AnimatedCircle
                        cx="160"
                        cy="160"
                        r={CIRCLE_RADIUS}
                        stroke={outlineColor as any}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        opacity={outlineOpacity as any}
                    />
                </Svg>
                <Text style={styles.sessionLabel}>Current Session</Text>
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
                <Text style={styles.totalTimeLabel}>Total Practice Time:</Text>
                {totalTime > 0 && (
                    <Text style={styles.totalTime}>
                        {formatTime(totalTime)}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
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
    description: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginVertical: 10,
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
    sessionLabel: {
        position: "absolute",
        fontSize: 17,
        fontWeight: "500",
        top: "34%",
        color: "#6b7280",
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
