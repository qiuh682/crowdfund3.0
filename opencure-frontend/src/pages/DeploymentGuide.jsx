import { useState } from 'react';

/**
 * DeploymentGuide - Mainnet Deployment Checklist
 *
 * Interactive checklist for deploying to mainnet
 */
export default function DeploymentGuide() {
  const [checklist, setChecklist] = useState({
    // Pre-deployment
    testsPass: false,
    contractAudited: false,
    walletFunded: false,
    backupKeys: false,
    // Configuration
    rpcConfigured: false,
    scientistSet: false,
    goalSet: false,
    // Deployment
    deployed: false,
    verified: false,
    frontendUpdated: false,
    // Post-deployment
    milestonesAdded: false,
    tested: false,
    announced: false,
  });

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mainnet Deployment Guide</h1>

      {/* Progress */}
      <div style={styles.progressSection}>
        <div style={styles.progressLabel}>
          Progress: {completedCount} / {totalCount} ({progress}%)
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      {/* Warning Banner */}
      <div style={styles.warning}>
        <strong>WARNING:</strong> Mainnet deployment uses real money.
        Double-check everything before proceeding!
      </div>

      {/* Phase 1: Pre-deployment */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Phase 1: Pre-Deployment Checks</h2>

        <ChecklistItem
          checked={checklist.testsPass}
          onToggle={() => toggleCheck('testsPass')}
          title="All Tests Passing"
          description="Run npx hardhat test and ensure all tests pass"
          command="cd hardhat-contracts && npx hardhat test"
        />

        <ChecklistItem
          checked={checklist.contractAudited}
          onToggle={() => toggleCheck('contractAudited')}
          title="Contract Audited"
          description="Have the contract reviewed by a security auditor or use automated tools"
          command="npx hardhat check # or use Slither/Mythril"
        />

        <ChecklistItem
          checked={checklist.walletFunded}
          onToggle={() => toggleCheck('walletFunded')}
          title="Wallet Funded"
          description="Ensure deployer wallet has enough ETH for gas (~0.05 ETH)"
        />

        <ChecklistItem
          checked={checklist.backupKeys}
          onToggle={() => toggleCheck('backupKeys')}
          title="Backup Keys"
          description="Securely backup your private keys and seed phrase"
        />
      </div>

      {/* Phase 2: Configuration */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Phase 2: Configuration</h2>

        <ChecklistItem
          checked={checklist.rpcConfigured}
          onToggle={() => toggleCheck('rpcConfigured')}
          title="RPC URL Configured"
          description="Set MAINNET_RPC_URL in .env (use Alchemy or Infura)"
          command="MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY"
        />

        <ChecklistItem
          checked={checklist.scientistSet}
          onToggle={() => toggleCheck('scientistSet')}
          title="Scientist Address Set"
          description="Set SCIENTIST_ADDRESS in .env - this receives milestone funds"
          command="SCIENTIST_ADDRESS=0x..."
        />

        <ChecklistItem
          checked={checklist.goalSet}
          onToggle={() => toggleCheck('goalSet')}
          title="Goal Amount Set"
          description="Set GOAL_AMOUNT in .env (in USDC without decimals)"
          command="GOAL_AMOUNT=100000"
        />
      </div>

      {/* Phase 3: Deployment */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Phase 3: Deployment</h2>

        <ChecklistItem
          checked={checklist.deployed}
          onToggle={() => toggleCheck('deployed')}
          title="Deploy Contract"
          description="Run the mainnet deployment script"
          command="CONFIRM_DEPLOY=true npx hardhat run scripts/deploy-mainnet.js --network mainnet"
        />

        <ChecklistItem
          checked={checklist.verified}
          onToggle={() => toggleCheck('verified')}
          title="Verify on Etherscan"
          description="Contract should auto-verify, or manually verify"
          command="npx hardhat verify --network mainnet CONTRACT_ADDRESS ARGS"
        />

        <ChecklistItem
          checked={checklist.frontendUpdated}
          onToggle={() => toggleCheck('frontendUpdated')}
          title="Update Frontend"
          description="Update src/utils/contracts.js with new mainnet addresses"
        />
      </div>

      {/* Phase 4: Post-deployment */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Phase 4: Post-Deployment</h2>

        <ChecklistItem
          checked={checklist.milestonesAdded}
          onToggle={() => toggleCheck('milestonesAdded')}
          title="Add Milestones"
          description="Add project milestones via Dashboard"
        />

        <ChecklistItem
          checked={checklist.tested}
          onToggle={() => toggleCheck('tested')}
          title="Test on Mainnet"
          description="Make a small test donation to verify everything works"
        />

        <ChecklistItem
          checked={checklist.announced}
          onToggle={() => toggleCheck('announced')}
          title="Announce Launch"
          description="Share on Twitter, Discord, and community channels"
        />
      </div>

      {/* Important Addresses */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Important Addresses</h2>
        <div style={styles.addressBox}>
          <div style={styles.addressItem}>
            <strong>Mainnet USDC:</strong>
            <code>0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48</code>
          </div>
          <div style={styles.addressItem}>
            <strong>Etherscan:</strong>
            <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">
              https://etherscan.io
            </a>
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Commands</h2>
        <div style={styles.commandBox}>
          <pre>{`# 1. Run tests
cd hardhat-contracts
npx hardhat test

# 2. Check gas costs
REPORT_GAS=true npx hardhat test

# 3. Deploy to mainnet
CONFIRM_DEPLOY=true npx hardhat run scripts/deploy-mainnet.js --network mainnet

# 4. Verify contract
npx hardhat verify --network mainnet <CONTRACT_ADDRESS> <USDC_ADDRESS> <SCIENTIST_ADDRESS> <GOAL_WEI>

# 5. Build frontend
cd ../opencure-frontend
npm run build`}</pre>
        </div>
      </div>
    </div>
  );
}

/**
 * Checklist Item Component
 */
function ChecklistItem({ checked, onToggle, title, description, command }) {
  return (
    <div
      style={{
        ...styles.checklistItem,
        background: checked ? '#E8F5E9' : 'white',
        borderColor: checked ? '#4CAF50' : '#E0E0E0',
      }}
      onClick={onToggle}
    >
      <div style={styles.checkbox}>
        {checked ? (
          <span style={styles.checked}>✓</span>
        ) : (
          <span style={styles.unchecked}>○</span>
        )}
      </div>
      <div style={styles.itemContent}>
        <h4 style={{
          ...styles.itemTitle,
          textDecoration: checked ? 'line-through' : 'none',
          color: checked ? '#757575' : '#0f2027',
        }}>
          {title}
        </h4>
        <p style={styles.itemDescription}>{description}</p>
        {command && (
          <code style={styles.itemCommand}>{command}</code>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#0f2027',
    textAlign: 'center',
  },

  // Progress
  progressSection: {
    marginBottom: '2rem',
  },
  progressLabel: {
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#424242',
  },
  progressBar: {
    height: '20px',
    background: '#E0E0E0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    transition: 'width 0.3s ease',
  },

  // Warning
  warning: {
    padding: '1rem',
    background: '#FFF3E0',
    border: '2px solid #FF9800',
    borderRadius: '8px',
    marginBottom: '2rem',
    color: '#E65100',
  },

  // Section
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#0f2027',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #FF9800',
  },

  // Checklist Item
  checklistItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    marginBottom: '0.75rem',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  checkbox: {
    fontSize: '1.5rem',
    width: '30px',
    flexShrink: 0,
  },
  checked: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  unchecked: {
    color: '#BDBDBD',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '1rem',
  },
  itemDescription: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.9rem',
    color: '#616161',
  },
  itemCommand: {
    display: 'block',
    padding: '0.5rem',
    background: '#F5F5F5',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: '#424242',
  },

  // Address box
  addressBox: {
    padding: '1rem',
    background: '#F5F5F5',
    borderRadius: '8px',
  },
  addressItem: {
    marginBottom: '0.5rem',
    wordBreak: 'break-all',
  },

  // Command box
  commandBox: {
    background: '#1e1e1e',
    padding: '1rem',
    borderRadius: '8px',
    overflow: 'auto',
  },
};
