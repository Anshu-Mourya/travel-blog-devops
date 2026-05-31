pipeline {
    agent any

    stages {

        stage('Welcome') {
            steps {
                echo 'Travel Blog CI/CD Pipeline Started'
            }
        }

        stage('GitHub Check') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Kubernetes Check') {
            steps {
                sh 'kubectl get nodes'
                sh 'kubectl get pods -A'
            }
        }
    }
}