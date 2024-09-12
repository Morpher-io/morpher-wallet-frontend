import { defineConfig } from 'cypress'
import { authenticator } from 'otplib';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    retries: 1,
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    env: {
      "firstEmail": "test@email.com",
      "secondEmail": "test2@email.com",
      "firstPassword": "Test123!",
      "secondPassword": "Test1234!",
      "incorrectPassword": "Test12345!",
      "backendUrl": "https://wallet-api-dev-test.morpher.com"
    },
    setupNodeEvents(on, config) {
      on('task', {
        // deconstruct the individual properties
        generateOTP(secret) {
          return authenticator.generate(secret);

        },
      })
    },
  }
})
