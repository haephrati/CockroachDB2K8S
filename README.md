# CockroachDB2K8S
Executing code with containers/Dockers can be very different then doing so for desktop or web apps as it is based on several moving parts which must work together. Lets look at the steps we will need to follow

1. Write the application we wish to use.
2. Containerize the app via docker tool (Dockerfile)- docker build. 
3. Push to registry docker push.
4. Use the registry URL Address in the sample-app.yaml
5. Deploy the app on K8s kubectl apply.
6. View the logs with the output in the K8s dashboard.
