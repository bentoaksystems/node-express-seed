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
        sh 'docker-compose up'
      }
    }
    stage('Test') {
      steps {
        sh 'jasmine-node --verbose spec/jasmine/sql.spec.js --forceexit --captureExceptions'
      }
    }
  }
}