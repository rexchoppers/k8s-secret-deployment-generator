const file = require('file-system');
const fs = require('fs');
const YAML = require('yaml');

const { base64encode } = require('nodejs-base64');

// Create result file
const resultFileName = 'results_' + Date.now().toString();
file.mkdir(resultFileName);

async function runProcess() {
    const secretConfigsToWrite = [];

    const deploymentConfig = {
        spec: {
            template: {
                spec: {
                    containers: [
                        {
                            name: 'acontainer',
                            image: 'alpine',
                            env: [

                            ]
                        }
                    ]
                }
            }
        }
    };

    // Load YAML file from template
    const templateData = await fs.readFileSync(__dirname + '/template.yaml').toString();

    const templateDataYaml = await YAML.parse(templateData);

    for(const [secretName, keyValuePair] of Object.entries(templateDataYaml)) {
        let k8SecretName = secretName.replace(/_/g, '-').toLowerCase();

        const secretConfig = {
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                name: k8SecretName,
                namespace: 'default'
            },
            type: 'Opaque',
            data: {}
        };

        for(const [key, value] of Object.entries(keyValuePair)) {
            // Sort secret config first
            let k8SecretKeySplit = key.toLowerCase().split('_');
            let k8SecretKey = key.toLowerCase().split('_');

            const k8SecretValue = base64encode(value);

            if(k8SecretKeySplit.length === 1) {
                k8SecretKey = k8SecretKeySplit[0];
            } else {
                k8SecretKey = k8SecretKeySplit[k8SecretKeySplit.length - 1];
            }

            secretConfig.data[k8SecretKey] = k8SecretValue;

            // Next, add to deployment config
            deploymentConfig.spec.template.spec.containers[0].env.push({
                name: key,
                valueFrom: {
                    secretKeyRef: {
                        name: k8SecretName,
                        key: k8SecretKey
                    }
                }
            });
        }

        secretConfigsToWrite.push(secretConfig);
    }

    // Write secret config file
    let stringToWriteSecret = '';

    for(const secretConfig of secretConfigsToWrite) {
        stringToWriteSecret += YAML.stringify(secretConfig) + '---\n';
    }

    await fs.writeFileSync(__dirname + '/' + resultFileName + '/secrets.yaml', stringToWriteSecret);

    // Finally, write deployment config file
    await fs.writeFileSync(__dirname + '/' + resultFileName + '/deployment.yaml', YAML.stringify(deploymentConfig));
}

runProcess();
