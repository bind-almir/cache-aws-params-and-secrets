const getParamOrSecret = async (path, isSecret) => {
  const port = process.env.PARAMETERS_SECRETS_EXTENSION_HTTP_PORT || '2773';
  const endpoint = isSecret
    ? `http://localhost:${port}/secretsmanager/get?secretId=${path}` 
    : `http://localhost:${port}/systemsmanager/parameters/get?name=${path}`;
  const headers = {
    'X-Aws-Parameters-Secrets-Token': process.env.AWS_SESSION_TOKEN,
  };
  const response = await fetch(endpoint, { headers });
  console.log(response);
  const responseJson = await response.json();
  console.log(responseJson);
  return isSecret ? responseJson.SecretString : responseJson.Parameter.Value;
  
}

export const handler = async () => {
  const param = await getParamOrSecret(process.env.PARAMETER_NAME, false);
  const secret = await getParamOrSecret(process.env.SECRET_NAME, true);
  return {
    statusCode: 200,
    body: JSON.stringify({ param, secret }),
  };
}