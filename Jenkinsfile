pipeline {
    agent any
    
    tools {
        nodejs 'node18'
    }
    
    environment {
        // Access GitHub secrets via environment variables
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION = credentials('AWS_REGION')
        S3_BUCKET_NAME = credentials('S3_BUCKET_NAME')
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
        
        stage('Deploy to S3') {
            steps {
                // Check if AWS CLI is installed
                sh 'aws --version || (echo "Installing AWS CLI" && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install)'
                
                // Configure AWS CLI and deploy
                sh '''
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                    aws configure set default.region $AWS_REGION
                    aws s3 sync build/ s3://$S3_BUCKET_NAME/ --delete
                '''
                
                echo "Deployment completed successfully"
                echo "Website available at: http://$S3_BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com/"
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}