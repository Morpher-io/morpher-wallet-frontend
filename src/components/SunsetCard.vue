<template>
  <div class="sunset-card">
    <div class="sunset-icon-wrapper">
      <svg class="sunset-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Sun shape -->
        <path d="M12 16.5C8.96243 16.5 6.5 18.9624 6.5 22H17.5C17.5 18.9624 15.0376 16.5 12 16.5Z" fill="#F5A623"/>
        <!-- Rays -->
        <path d="M12 13.5V9.5M17.5 14.5L19.5 12.5M6.5 14.5L4.5 12.5M16 11L18 9M8 11L6 9" stroke="#F5A623" stroke-width="2" stroke-linecap="round"/>
        <!-- Horizon line -->
        <rect x="5" y="21.5" width="14" height="2" rx="1" fill="#F5A623"/>
      </svg>
    </div>
    
    <h2 class="sunset-title">Morpher.com is shutting down</h2>
    
    <div class="sunset-section">
      <h3 class="sunset-subtitle">Login to Export Your Seed Phrase</h3>
      <p class="sunset-text">
        Please enter the same password, Gmail, or Apple account that you used on Morpher.com. Then you will be directed to the Export Keys page in Settings.
      </p>
    </div>
    
    <div class="sunset-section">
      <h3 class="sunset-subtitle">What is wallet.morpher.com?</h3>
      <p class="sunset-text">
        This is the homepage of the Morpher Wallet, a fully non-custodial wallet that supported your trading in the Morpher app.
      </p>
    </div>
    
    <div class="sunset-list">
      <div class="sunset-list-item">
        <div class="icon-check">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#48C774"/>
            <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="sunset-list-text">
          Make sure you are on wallet.morpher.com. Only enter your password on domains that end in morpher.com
        </p>
      </div>
      
      <div class="sunset-list-item">
        <div class="icon-info">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#4A4A4A" stroke-width="2"/>
            <path d="M12 16V12" stroke="#4A4A4A" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="8" r="1" fill="#4A4A4A"/>
          </svg>
        </div>
        <p class="sunset-list-text">
          Need help? Visit the <a href="https://support.morpher.com/en/article/export-morpher-wallet-d6wr6g/" target="_blank" class="sunset-link">export wallet support page</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SunsetCard'
})
</script>

<style scoped>
.sunset-card {
  background: white;
  
  border-radius: 12px;
  padding: 32px;
  max-width: 350px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333333;
  margin: 20px auto;
  flex-shrink: 0;
}

.sunset-icon-wrapper {
  background: #FFF9E6;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
}

.sunset-icon {
  width: 28px;
  height: 28px;
}

.sunset-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: #1a1a1a;
}

.sunset-section {
  margin-bottom: 20px;
}

.sunset-subtitle {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333333;
}

.sunset-text {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: #4a4a4a;
}

.sunset-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sunset-list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.icon-check svg,
.icon-info svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.sunset-list-text {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: #4a4a4a;
}

.sunset-link {
  color: #3B82F6;
  text-decoration: none;
}

.sunset-link:hover {
  text-decoration: underline;
}

@media screen and (max-width: 768px) {
  .sunset-card {
    padding: 24px;
    margin: 16px auto;
    max-width: 370px;
  }
}
</style>
