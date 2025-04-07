import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Insights() {
    const { DecisionTreeClassifier } = require('ml-cart');
    const { user } = useAuthContext();
    const [feedback, setFeedback] = useState('');
    const { documents, isLoading, error } = useCollection(
        'screentime',
        ["uid", "==", user.uid],
        ["createdAt", "desc"]
    );

    function mean(arr) {
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }


    function generateData() {
        const data = [];
        const labels = [];

        const screentimeArr = documents.map(doc => Number(doc.amount));
        const sleepQualityArr = documents.map(doc => doc.sleepQuality);
        const moodArr = documents.map(doc => doc.positiveActivation);

        const screentimeMean = mean(screentimeArr);
        const sleepQualityMean = mean(sleepQualityArr);
        const moodMean = mean(moodArr)

        documents.forEach((_, index) => {
            const screentime = screentimeArr[index];
            const sleepQuality = sleepQualityArr[index];
            const mood = moodArr[index];

            const goodMood = mood >= 3 ? 1 : 0; // Mood above or equal to average is considered good
            data.push([screentime, sleepQuality]); // Features
            labels.push(goodMood); // Target label
        });

        return { data, labels, screentimeMean, sleepQualityMean, moodMean };
    }

    async function testClassifier(data, labels, classifier) {
        const splitIndex = Math.floor(0.8 * data.length);
        const trainData = data.slice(0, splitIndex);
        const trainLabels = labels.slice(0, splitIndex);
        const testData = data.slice(splitIndex);
        const testLabels = labels.slice(splitIndex);

        classifier.train(trainData, trainLabels);
        const predictions = classifier.predict(testData);

        let correct = 0;
        for (let i = 0; i < predictions.length; i++) {
            if (predictions[i] === testLabels[i]) {
                correct++;
            }
        }
        const accuracy = correct / predictions.length;
        console.log(`Test Accuracy: ${accuracy * 100}%`);

        return accuracy
    }

    async function giveFeedback(data, labels, classifier, screentimeMean, sleepQualityMean, moodMean, todaysMood, todaysScreentime, todaysSleepQuality) {
        let feedbackMessage = '';

        let goodCount = 0;
        let badCount = 0;

        if (todaysScreentime <= screentimeMean) {
            goodCount++;
        } else {
            badCount++;
        }

        if (todaysSleepQuality >= sleepQualityMean) {
            goodCount++;
        } else {
            badCount++;
        }

        if (todaysMood >= moodMean) {
            goodCount++;
        } else {
            badCount++;
        }

        const accuracy = await testClassifier(data, labels, classifier);
        console.log(todaysScreentime)
        console.log(todaysMood)
        const predictedMood = classifier.predict([[screentimeMean, sleepQualityMean]])[0];
        console.log(predictedMood);
        if (accuracy >= .75) {
            if (predictedMood === 0) {
                feedbackMessage = "Our analysis suggests that your current average screentime and sleep quality might lead to a lower mood. ";
                if (badCount > goodCount) {
                    feedbackMessage += " In addition, your habits today seem worse than your usual average. Consider reducing your screentime and improving your sleep quality to help boost your mood. ";
                } else {
                    feedbackMessage += " However, it's great to see that today's habits are better than your average! Keep up the improvements to help lift your mood further. ";
                }
            } else {
                feedbackMessage = "Our analysis suggests that your current average screentime and sleep quality means you're likely to have a good mood! ";
                if (goodCount > badCount) {
                    feedbackMessage += " Your habits today are better than usual, which is excellent! Keep up the good work!. ";
                } else {
                    feedbackMessage += " Although some of your habits today are not as strong as your average. You might consider focusing on improving those areas. ";
                }
            }
        }
        else {
            feedbackMessage = "Need more data to analyse trends accurately";

        }
        // take in inpit for today and if they are better than avaerage commend user    
        setFeedback(feedbackMessage);
        console.log(feedbackMessage);


    }


    function handlePrediction(todaysMood, todaysScreentime, todaysSleepQuality) {

        const { data, labels, screentimeMean, sleepQualityMean, moodMean } = generateData();
        const classifier = new DecisionTreeClassifier({ maxDepth: 3, minNumSamples: 6 });

        giveFeedback(data, labels, classifier, screentimeMean, sleepQualityMean, moodMean, todaysMood, todaysScreentime, todaysSleepQuality)

    }

    useEffect(() => {
        if (!isLoading && documents && documents.length > 0) {
            const lastDoc = documents.at(0);
            const todaysMood = lastDoc.positiveActivation
            const todaysScreentime = lastDoc.amount
            const todaysSleepQuality = lastDoc.sleepQuality
            if (documents.length > 30) {
                handlePrediction(todaysMood, todaysScreentime, todaysSleepQuality);
            }
        }
    }, [documents, isLoading]);

    useEffect(() => {
        console.log('Updated feedback:', feedback);
    }, [feedback]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;
    if (!documents || documents.length === 0) return <p>No records to display.</p>;
    if (documents.length < 30) { return <p>Not enough data to analyse</p> }
    return (
        <div>
            {feedback && (
                <div style={{color: 'white', padding: '20px', borderRadius: '8px' }}>
                    <h2 style={{color : 'white'}}>Actionable Feedback:</h2>
                    <br />
                    <p style={{color:"white"}}>{feedback}</p>
                </div>
            )}

        </div>
    );
}

