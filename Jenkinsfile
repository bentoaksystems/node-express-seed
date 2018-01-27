pipeline {
  agent {
    docker {
      image 'node:8-alpine'
      args '-p 3000:3000'
    }
    
  }
  stages {
    stage('Build') {
      steps {
        sh './jenkins/test.sh'
      }
    }
    stage('Test') {
      steps {
        sh "npm test"
      }
    }
  }
}
