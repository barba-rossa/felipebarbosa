pipeline {
    agent any
    
    tools {
        nodejs 'node18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}