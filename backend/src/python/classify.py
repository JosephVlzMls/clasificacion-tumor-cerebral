import numpy
import pandas
import sklearn.svm

def normalize(FEATURES):
	MAX = numpy.max(FEATURES, axis = 0)
	MIN = numpy.min(FEATURES, axis = 0)
	return (FEATURES - MIN) / (MAX - MIN)

X = numpy.matrix(pandas.read_csv('src/python/features.csv', header = None).values.tolist())
Y = numpy.array(pandas.read_csv('src/python/labels.csv', header = None).values.tolist())[:, 0]
F = numpy.matrix(pandas.read_csv('public/features.csv', header = None).values.tolist())
S = [0, 2, 5, 7, 8, 12, 18, 23, 24, 25, 27, 31, 34, 35, 40, 41, 42, 50, 52, 62, 71, 77]

X = numpy.concatenate((X, F), axis = 0)
X = normalize(X)

F = X[-1:]
X = numpy.delete(X, -1, axis = 0)

(X, F) = (X[:, S], F[:, S])

classifier = sklearn.svm.SVC(kernel = 'rbf', gamma = 0.03690602066966724, C = 1686.7144033635979667).fit(X, Y)
print(classifier.predict(F)[0])
