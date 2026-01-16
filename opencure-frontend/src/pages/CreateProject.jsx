import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

/**
 * CreateProject - 创建新研究项目
 *
 * 说明如何部署新的项目合约
 */
export default function CreateProject() {
  const { isConnected, account } = useWeb3();
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    diseaseType: '',
    scientistAddress: '',
    goalAmount: '',
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateDeployScript = () => {
    return `// Deploy script for: ${formData.projectName || 'Your Project'}
// Run with: npx hardhat run scripts/deploy-project.js --network sepolia

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // USDC Token address (use existing or deploy new)
  const USDC_ADDRESS = "0x8410f9Cf462C4dCc9Fb97971fe65F8D711Fa3F96";

  // Deploy OpenCureEscrow
  const Escrow = await hre.ethers.getContractFactory("OpenCureEscrow");
  const escrow = await Escrow.deploy(
    USDC_ADDRESS,
    "${formData.scientistAddress || '0x_SCIENTIST_ADDRESS'}",
    hre.ethers.parseUnits("${formData.goalAmount || '100000'}", 6)
  );
  await escrow.waitForDeployment();

  console.log("OpenCureEscrow deployed to:", await escrow.getAddress());
  console.log("Project: ${formData.projectName || 'New Project'}");
  console.log("Goal: $${formData.goalAmount || '100000'} USDC");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});`;
  };

  // 未连接钱包
  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.notConnected}>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to create a project.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Research Project</h1>

      {/* 步骤指示器 */}
      <div style={styles.steps}>
        <div style={{...styles.step, ...(step >= 1 ? styles.activeStep : {})}}>
          <span style={styles.stepNumber}>1</span>
          <span>Basic Info</span>
        </div>
        <div style={styles.stepLine}></div>
        <div style={{...styles.step, ...(step >= 2 ? styles.activeStep : {})}}>
          <span style={styles.stepNumber}>2</span>
          <span>Funding</span>
        </div>
        <div style={styles.stepLine}></div>
        <div style={{...styles.step, ...(step >= 3 ? styles.activeStep : {})}}>
          <span style={styles.stepNumber}>3</span>
          <span>Deploy</span>
        </div>
      </div>

      {/* Step 1: 基本信息 */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 1: Project Information</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Project Name *</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="e.g., DMD Gene Therapy Research"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your research project..."
              style={styles.textarea}
              rows={4}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Disease Type</label>
            <select
              name="diseaseType"
              value={formData.diseaseType}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select disease type...</option>
              <option value="Neuromuscular">Neuromuscular Disease</option>
              <option value="Metabolic">Metabolic Disorder</option>
              <option value="Genetic">Genetic Disorder</option>
              <option value="Autoimmune">Autoimmune Disease</option>
              <option value="Cancer">Rare Cancer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => setStep(2)}
              style={styles.nextBtn}
              disabled={!formData.projectName}
            >
              Next: Funding Details
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 资金信息 */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 2: Funding Details</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Scientist/Researcher Address *</label>
            <input
              type="text"
              name="scientistAddress"
              value={formData.scientistAddress}
              onChange={handleChange}
              placeholder="0x..."
              style={styles.input}
            />
            <span style={styles.hint}>
              This address will receive released milestone funds
            </span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Funding Goal (USDC) *</label>
            <input
              type="number"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              placeholder="100000"
              style={styles.input}
              min="1"
            />
            <span style={styles.hint}>
              Total amount needed for the research project
            </span>
          </div>

          <div style={styles.infoBox}>
            <h4>How Milestones Work</h4>
            <p>After deployment, you can add milestones from the Dashboard:</p>
            <ul>
              <li>Define research phases with specific funding amounts</li>
              <li>Mark milestones complete when achieved</li>
              <li>Release funds to the scientist per milestone</li>
            </ul>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(1)} style={styles.backBtn}>
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              style={styles.nextBtn}
              disabled={!formData.scientistAddress || !formData.goalAmount}
            >
              Next: Deploy
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 部署 */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Step 3: Deploy Your Contract</h2>

          <div style={styles.summary}>
            <h4>Project Summary</h4>
            <div style={styles.summaryRow}>
              <span>Project Name:</span>
              <strong>{formData.projectName}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Disease Type:</span>
              <strong>{formData.diseaseType || 'Not specified'}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Scientist:</span>
              <strong>{formData.scientistAddress.slice(0, 10)}...</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Funding Goal:</span>
              <strong>${Number(formData.goalAmount).toLocaleString()} USDC</strong>
            </div>
          </div>

          <div style={styles.deploySection}>
            <h4>Deployment Instructions</h4>
            <p>
              Each project requires its own smart contract. Copy the script below
              and run it in your Hardhat project:
            </p>

            <div style={styles.codeBlock}>
              <pre>{generateDeployScript()}</pre>
              <button
                onClick={() => navigator.clipboard.writeText(generateDeployScript())}
                style={styles.copyBtn}
              >
                Copy Script
              </button>
            </div>

            <div style={styles.steps2}>
              <h4>Steps to Deploy:</h4>
              <ol>
                <li>Copy the script above</li>
                <li>Save as <code>scripts/deploy-project.js</code></li>
                <li>Run: <code>npx hardhat run scripts/deploy-project.js --network sepolia</code></li>
                <li>Update <code>src/utils/contracts.js</code> with new address</li>
                <li>Restart the frontend</li>
              </ol>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={() => setStep(2)} style={styles.backBtn}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* 当前连接信息 */}
      <div style={styles.footer}>
        <p>
          Connected as: <code>{account.slice(0, 6)}...{account.slice(-4)}</code>
        </p>
        <p style={styles.footerNote}>
          You will be the owner of the deployed contract
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#0f2027',
    textAlign: 'center',
  },
  notConnected: {
    textAlign: 'center',
    padding: '4rem',
    background: '#F5F5F5',
    borderRadius: '12px',
  },

  // 步骤指示器
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '0.5rem',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    background: '#F5F5F5',
    color: '#757575',
    transition: 'all 0.3s',
  },
  activeStep: {
    background: '#FF9800',
    color: 'white',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  stepLine: {
    width: '30px',
    height: '2px',
    background: '#E0E0E0',
  },

  // 卡片
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  cardTitle: {
    fontSize: '1.3rem',
    marginBottom: '1.5rem',
    color: '#0f2027',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #FF9800',
  },

  // 表单
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#424242',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
    boxSizing: 'border-box',
  },
  hint: {
    display: 'block',
    marginTop: '0.25rem',
    fontSize: '0.85rem',
    color: '#757575',
  },

  // 按钮组
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  nextBtn: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  backBtn: {
    padding: '0.75rem 1.5rem',
    background: '#F5F5F5',
    color: '#424242',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },

  // 信息框
  infoBox: {
    background: '#E3F2FD',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
  },

  // 总结
  summary: {
    background: '#F5F5F5',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #E0E0E0',
  },

  // 部署区域
  deploySection: {
    marginTop: '1rem',
  },
  codeBlock: {
    position: 'relative',
    background: '#1e1e1e',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    overflow: 'auto',
  },
  copyBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    padding: '0.4rem 0.8rem',
    background: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  steps2: {
    marginTop: '1.5rem',
  },

  // 页脚
  footer: {
    textAlign: 'center',
    color: '#757575',
    fontSize: '0.9rem',
  },
  footerNote: {
    color: '#FF9800',
    fontWeight: '500',
  },
};
