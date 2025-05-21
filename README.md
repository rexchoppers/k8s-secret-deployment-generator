# K8s Secret + Deployment Generator

**NOTE**: With the rise of generative AI, use that (Providing it doesn't learn off your secrets) This script was handy to have at the time

Quick and dirty way to convert a lot of environment variables into 1 secret + deployment file

This script will ingest a file of environment variables and convert them into a corresponding secrets and deployment file. 

Modify this or use it as you please. I only created this for a close friend who didn't want to write out 60 environment variables in our transition to Kubernetes
## Installation

1. Clone `git@github.com:rexchoppers/k8s-secret-deployment-generator.git`
2. Run `npm i`
3. Copy `template-example.yaml` to `template.yaml`
4. Modify the template to suit your needs
5. Run `node index.ts`
6. Once completed, the secrets and deployment file will be under the generated `results_` folder


## Contributing

Contributions are always welcome

I don't have any red tape contributing process so if you want to add anything, just create a PR and let me know.
## Authors

- [@rexchoppers](https://github.com/rexchoppers)


## License

[MIT](https://choosealicense.com/licenses/mit/)

