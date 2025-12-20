export const generateGoogleFormScript = (webhookUrl: string) => `function onFormSubmit(e) {
    var formResponse = e.response;
    var itemResponses = formResponse.getItemResponses();

    var responseData = {};
    for (var i = 0; i < itemResponses.length; i++) {
        var itemResponse = itemResponses[i];
        responseData[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
    }

    // Prepare the payload
    var payload = {
        formId: e.source.getId(),
        formTitle: e.source.getTitle(),
        responseId: formResponse.getId(),
        timestamp: formResponse.getTimestamp(),
        responses: responseData
    }

    // Send the webhook
    var options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
    }
    
    var WEBHOOK_URL = '${webhookUrl}';

    try {
        UrlFetchApp.fetch(WEBHOOK_URL, options);
    } catch (error) {
        console.error('Error sending webhook: ' + error);
    }
}`
