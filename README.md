# Game Addiction Risk Prediction

## Overview

Gaming Addiction Risk Prediction is an end-to-end Machine Learning project designed to predict the risk level of gaming addiction based on user behavioral and gaming-related attributes. The project demonstrates the complete machine learning lifecycle, from data preprocessing and experimentation to model training, hyperparameter optimization, evaluation, and deployment readiness.

The primary objective is to identify individuals who may be at risk of gaming addiction and classify them accurately using machine learning techniques.

---

## Features

* Data Cleaning and Preprocessing
* Exploratory Data Analysis (EDA)
* Feature Engineering
* Model Training and Evaluation
* Hyperparameter Tuning using Optuna
* End-to-End Machine Learning Pipeline
* Model Serialization for Deployment
* Dockerized Application
* Reproducible Experiments

---

## Project Workflow

### 1. Data Collection

The dataset contains user behavioral and gaming-related information that can be used to determine gaming addiction risk levels.

### 2. Data Cleaning

* Handled missing values
* Removed inconsistencies
* Processed categorical and numerical features
* Prepared data for model training

### 3. Data Preprocessing

* Feature transformation
* Encoding categorical variables
* Data scaling and preprocessing pipeline creation
* Train-test split preparation

### 4. Experimentation

All experimentation and model comparisons are available in the `notebook/experiment.ipynb` notebook.

Experiments performed:

* Data analysis
* Feature selection
* Model comparison
* Hyperparameter tuning
* Performance evaluation

### 5. Hyperparameter Optimization

Optuna was used to perform efficient hyperparameter tuning for the Random Forest model.

Benefits:

* Automated search for optimal parameters
* Improved model performance
* Reduced manual trial-and-error

### 6. Model Training

The final model was trained using:

**Algorithm:** Random Forest Classifier

The optimized hyperparameters obtained from Optuna were used to build the final production-ready model.

### 7. Pipeline Creation

A complete end-to-end machine learning pipeline was created, including:

* Data preprocessing
* Feature transformation
* Model training
* Prediction pipeline

The final implementation is available in:

`notebook/Final.ipynb`

---

## Model Performance

| Metric   | Score |
| -------- | ----- |
| Accuracy | 96%   |

The Random Forest model achieved an accuracy of **96%** on the evaluation dataset after hyperparameter optimization using Optuna.

---


## Technologies Used

### Programming Language

* Python

### Libraries

* Pandas
* NumPy
* Scikit-Learn
* Optuna
* Matplotlib
* Seaborn

### Deployment & Development Tools

* Git
* GitHub
* Docker

Aspiring Machine Learning Engineer passionate about building scalable and production-ready machine learning solutions.
