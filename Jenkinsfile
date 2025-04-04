pipeline {
    agent any
    
    tools {
        nodejs 'node18'
    }
    
    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION = credentials('AWS_REGION')
        S3_BUCKET_NAME = credentials('S3_BUCKET_NAME')
        AWS_CLI_INSTALL_DIR = '/var/jenkins_home/aws-cli'
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
        
        stage('Install/Update AWS CLI') {
            steps {
                script {
                    // Check if AWS CLI exists and install/update accordingly
                    def awsCliInstalled = sh(script: 'command -v aws || true', returnStdout: true).trim()
                    
                    if (!awsCliInstalled) {
                        echo "Installing AWS CLI..."
                        sh '''
                            curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
                            unzip awscliv2.zip
                            ./aws/install -i ${AWS_CLI_INSTALL_DIR} -b ${AWS_CLI_INSTALL_DIR}/bin
                            rm -rf awscliv2.zip aws
                        '''
                    } else {
                        echo "Updating AWS CLI..."
                        sh '''
                            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                            unzip awscliv2.zip
                            ./aws/install -i ${AWS_CLI_INSTALL_DIR} -b ${AWS_CLI_INSTALL_DIR}/bin --update
                            rm -rf awscliv2.zip aws
                        '''
                    }
                    
                    // Add AWS CLI to PATH
                    env.PATH = "${AWS_CLI_INSTALL_DIR}/bin:${env.PATH}"
                }
            }
        }
        
        stage('Deploy to S3') {
            steps {
                sh '''
                    aws --version
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