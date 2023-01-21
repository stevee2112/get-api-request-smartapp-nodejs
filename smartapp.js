const { SmartApp } = require('@smartthings/smartapp')
const axios = require('axios');

/* Define the SmartApp */
module.exports = new SmartApp()
	.enableEventLogging(2) // logs all lifecycle event requests/responses as pretty-printed JSON. Omit in production
	.configureI18n() // auto-create i18n files for localizing config pages

	// Configuration page definition
	.page('mainPage', (context, page, configData) => {

		// prompts user to select a contact sensor
		page.section('sensors', section => {
			section
				.deviceSetting('button')
				.capabilities(['button'])
				.required(true)
		})

		page.section('api', section => {
			section.textSetting('url')
		})
	})

	// Handler called whenever app is installed or updated
	// Called for both INSTALLED and UPDATED lifecycle events if there is
	// no separate installed() handler
	.updated(async (context, updateData) => {
		await context.api.subscriptions.delete()
		await context.api.subscriptions.subscribeToDevices(context.config.button,
			'button', '*', 'pushHandler')
	})

	// Handler called when the configured open/close sensor opens or closes
	.subscribedEventHandler('pushHandler', async (context, event) => {

		if (event.value == "pushed") {
			const {data} = await axios.get(context.configStringValue('url'));
			console.log(context.configStringValue('url'), "RESPONSE", data);
		}
	})
