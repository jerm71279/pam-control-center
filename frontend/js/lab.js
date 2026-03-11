/**
 * Lab Showcase — interactive PAM capability demonstrations.
 * All simulations run client-side; no backend required.
 */

// ── JIT Session simulation state ─────────────────────────
let _jit = {
  sessionId: null, accountName: null,
  maskedSecret: null, timer: null, elapsed: 0
};

let _labTab = 'jit';
let _oracleStep = 0;

// ── Oracle DB Workflow data ───────────────────────────────
const ORACLE_STEPS = [
  {
    title: 'Request Initiated',
    connector: null,
    stageHtml: `
      <div style="...">
        <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:8px;">ACCESS REQUEST</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-bright);margin-bottom:14px;">Oracle DB — ORCL-PROD @ db-server-01</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.72rem;">
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">REQUESTOR</span><br><span style="color:var(--text-bright);font-weight:600;">dba-admin</span></div>
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">TARGET PLATFORM</span><br><span style="color:var(--cyan);font-family:var(--font-mono);">OracleDB</span></div>
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">ACCOUNT</span><br><span style="color:var(--text-bright);font-family:var(--font-mono);">sys @ ORCL-PROD</span></div>
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">STATUS</span><br><span style="color:var(--amber);">&#x23F3; Pending Verification</span></div>
        </div>
        <div style="margin-top:12px;font-size:0.68rem;color:var(--text-muted);">Justification: Emergency DBA access — DB performance incident</div>
      </div>`
  },
  {
    title: 'Identity Verified',
    connector: 'IDP Connector',
    stageHtml: `
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <span style="color:var(--green);font-size:1.2rem;">&#x2714;</span>
          <div>
            <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);">PRIMARY ID</div>
            <div style="font-family:var(--font-mono);font-size:0.82rem;color:var(--text-bright);">j.smith@corp.com</div>
          </div>
          <span class="badge badge-green" style="margin-left:auto;">VERIFIED</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="color:var(--blue);font-size:1.2rem;">&#x1F511;</span>
          <div>
            <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);">SECONDARY ID (VAULT)</div>
            <div style="font-family:var(--font-mono);font-size:0.82rem;color:var(--text-bright);">j.smith-priv</div>
          </div>
          <span class="badge badge-green" style="margin-left:auto;">LOCATED</span>
        </div>
        <div style="margin-top:14px;font-size:0.68rem;color:var(--text-muted);">AD group membership confirmed. Vault account j.smith-priv has access to DB-Production safe.</div>
      </div>`
  },
  {
    title: 'Workflow Approval',
    connector: 'Workflow Engine',
    stageHtml: `
      <div>
        <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:10px;">DUAL-CONTROL APPROVAL CHAIN</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-surface);border:1px solid var(--green);border-radius:6px;">
            <div><span style="font-size:0.72rem;font-weight:600;color:var(--text-bright);">DBA Lead</span><br><span style="font-size:0.6rem;color:var(--text-muted);">maria.chen@corp.com</span></div>
            <span class="badge badge-green">&#x2714; APPROVED</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-surface);border:1px solid var(--green);border-radius:6px;">
            <div><span style="font-size:0.72rem;font-weight:600;color:var(--text-bright);">Security Ops</span><br><span style="font-size:0.6rem;color:var(--text-muted);">secops@corp.com</span></div>
            <span class="badge badge-green">&#x2714; APPROVED</span>
          </div>
        </div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:0.68rem;">
          <span style="color:var(--text-muted);">TTL WINDOW</span>
          <span style="font-family:var(--font-mono);color:var(--amber);">60 minutes</span>
        </div>
      </div>`
  },
  {
    title: 'Credential Retrieved',
    connector: 'CPM / CCP Connector',
    stageHtml: `
      <div>
        <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:8px;">VAULT API CALL</div>
        <div style="background:var(--bg-page);border:1px solid var(--border);border-radius:4px;padding:10px;font-family:var(--font-mono);font-size:0.68rem;color:var(--cyan);margin-bottom:12px;">
          POST /PasswordVault/api/Accounts/{id}/Password/Retrieve<br>
          Platform: <span style="color:var(--green);">OracleDB</span><br>
          Account: <span style="color:var(--text-bright);">sys @ ORCL-PROD</span>
        </div>
        <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:6px;">INJECTED CREDENTIAL</div>
        <div style="font-family:var(--font-mono);font-size:1rem;color:var(--text-bright);letter-spacing:0.08em;">Ab3k&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;7xPq</div>
        <div style="margin-top:8px;font-size:0.6rem;color:var(--text-muted);">Credential masked — only the PSM proxy receives the raw value</div>
      </div>`
  },
  {
    title: 'Session Launched',
    connector: 'PSM Connector',
    stageHtml: `
      <div>
        <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:8px;">PSM SESSION PROXY</div>
        <div style="background:var(--bg-page);border:1px solid var(--border);border-radius:4px;padding:10px;font-family:var(--font-mono);font-size:0.68rem;color:var(--cyan);margin-bottom:12px;">
          sys/&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;@//db-server-01:1521/ORCL
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.68rem;">
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">SESSION ID</span><br><span style="font-family:var(--font-mono);color:var(--text-bright);">PSM-DB-2847-A</span></div>
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">STATUS</span><br><span style="color:var(--green);">&#x25CF; RECORDING</span></div>
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">PORT</span><br><span style="font-family:var(--font-mono);color:var(--text-bright);">1521</span></div>
          <div><span style="color:var(--text-muted);font-family:var(--font-mono);">SERVICE NAME</span><br><span style="font-family:var(--font-mono);color:var(--text-bright);">ORCL</span></div>
        </div>
      </div>`
  },
  {
    title: 'Session Active',
    connector: 'PSM + Audit Connector',
    stageHtml: `
      <div>
        <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:8px;">LIVE ACTIVITY LOG</div>
        <div style="background:var(--bg-page);border:1px solid var(--border);border-radius:4px;padding:10px;font-family:var(--font-mono);font-size:0.65rem;color:var(--text-standard);line-height:1.9;">
          <span style="color:var(--text-muted);">14:22:01</span> <span style="color:var(--green);">SQL&gt;</span> SELECT * FROM DBA_USERS;<br>
          <span style="color:var(--text-muted);">14:22:03</span> <span style="color:var(--text-muted);">27 rows returned</span><br>
          <span style="color:var(--text-muted);">14:22:18</span> <span style="color:var(--green);">SQL&gt;</span> GRANT CONNECT TO app_user;<br>
          <span style="color:var(--text-muted);">14:22:19</span> <span style="color:var(--text-muted);">Grant succeeded.</span><br>
          <span style="color:var(--text-muted);">14:22:45</span> <span style="color:var(--green);">SQL&gt;</span> ALTER USER app_user IDENTIFIED BY &#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;;<br>
          <span style="color:var(--text-muted);">14:22:46</span> <span style="color:var(--text-muted);">User altered.</span>
        </div>
        <div style="margin-top:8px;font-size:0.6rem;color:var(--text-muted);">All commands recorded by PSM. Session timer: <span style="font-family:var(--font-mono);">00:01:47</span></div>
      </div>`
  },
  {
    title: 'Session End & Rotation',
    connector: 'CPM Connector',
    stageHtml: `
      <div>
        <div id="oracle-rotation-wrap">
          <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:8px;">CPM ROTATION</div>
          <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:6px;">
            <div id="oracle-progress-fill" style="height:100%;width:0%;background:var(--blue);border-radius:3px;transition:width 0.6s ease;"></div>
          </div>
          <div id="oracle-progress-msg" style="font-size:0.68rem;color:var(--text-muted);font-family:var(--font-mono);">Waiting to start rotation...</div>
        </div>
        <div style="margin-top:12px;">
          <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:6px;">OLD CREDENTIAL</div>
          <div id="oracle-cred-old" style="font-family:var(--font-mono);font-size:0.88rem;color:var(--text-bright);">Ab3k&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;7xPq</div>
          <div id="oracle-cred-new" style="display:none;font-family:var(--font-mono);font-size:0.88rem;color:var(--green);margin-top:6px;"></div>
        </div>
        <button onclick="_oracleRunRotation()" id="oracle-rotate-btn" style="margin-top:14px;padding:8px 18px;background:var(--amber);color:#000;font-weight:700;font-size:0.78rem;border:none;border-radius:6px;cursor:pointer;">
          &#x21BB; Trigger CPM Rotation
        </button>
      </div>`
  }
];

const ORACLE_CONNECTORS = [
  null, // step 0: no connector
  { name: 'IDP / Directory Connector', legacy: 'LDAP integration via PVWA — Secondary ID login', target: 'OAuth2/OIDC federation — Primary ID only' },
  { name: 'Workflow Engine', legacy: 'Dual-control via PVWA request portal', target: 'Native workflow engine with webhook triggers' },
  { name: 'CCP / AAM Connector', legacy: 'CCP agent + POST /Accounts/{id}/Password/Retrieve', target: 'OAuth2 secrets API — no agent required' },
  { name: 'PSM Connector', legacy: 'PSM for Databases via PVWA proxy (OracleDB platform)', target: 'Session connector with direct DB tunnel' },
  { name: 'PSM + Audit Connector', legacy: 'PSM session recording stored in vault', target: 'Session recording in cloud + SIEM forwarding' },
  { name: 'CPM Connector', legacy: 'CPM OracleDB.ini — ALTER USER {user} IDENTIFIED BY', target: 'Privilege Cloud: same CPM  |  Delinea: PowerShell RPC script' }
];

function _labSwitchTab(tab) {
  _labTab = tab;
  ['jit','creds','oracle','connectors','identity'].forEach(t => {
    const panel = document.getElementById('lab-panel-' + t);
    const btn   = document.getElementById('lab-tab-' + t);
    if (panel) panel.style.display = (t === tab) ? 'block' : 'none';
    if (btn)   btn.classList.toggle('active', t === tab);
  });
}

function renderLabShowcase() {
  const el = document.getElementById('labContent');
  if (!el) return;

  el.innerHTML = `

  <div class="view-tabs">
    <button id="lab-tab-jit"        class="view-tab active"  onclick="_labSwitchTab('jit')">JIT Session Demo</button>
    <button id="lab-tab-creds"      class="view-tab"         onclick="_labSwitchTab('creds')">Credential Types</button>
    <button id="lab-tab-oracle"     class="view-tab"         onclick="_labSwitchTab('oracle')">Oracle DB Workflow</button>
    <button id="lab-tab-connectors" class="view-tab"         onclick="_labSwitchTab('connectors')">Connector Comparison</button>
    <button id="lab-tab-identity"   class="view-tab"         onclick="_labSwitchTab('identity')">Identity Transform</button>
  </div>

  <!-- ══ Tab 1: JIT Session Demo ══ -->
  <div id="lab-panel-jit">

    <!-- ══ Demo 1: JIT Secret Injection & Rotation ══ -->
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-header">
        <div class="panel-title">&#x1F510; Live Demo — JIT Secret Injection &amp; Auto-Rotation</div>
        <span style="font-size:0.6rem;color:var(--text-muted);font-family:var(--font-mono);">SIMULATED · NO VAULT REQUIRED</span>
      </div>
      <div class="panel-body" style="padding:20px;">

        <p style="font-size:0.72rem;color:var(--text-standard);line-height:1.7;margin-bottom:20px;">
          This demo shows the <strong>Just-In-Time privileged access flow</strong>: a user lands on a web page,
          the platform injects a credential directly from the CyberArk vault (the user never touches the vault UI),
          and when the session ends the secret is <strong>automatically rotated</strong> so the injected credential
          is immediately invalidated.
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;" id="jit-grid">

          <!-- LEFT: form / active session -->
          <div>
            <!-- Phase 1: Setup form -->
            <div id="jit-setup">
              <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:6px;">TARGET ACCOUNT</div>
              <select id="jit-account" style="width:100%;padding:8px 10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;color:var(--text-bright);font-size:0.78rem;margin-bottom:12px;">
                <option value="demo-001">svc-webportal @ web-server-01 (WinServerLocal)</option>
                <option value="demo-002">svc-database @ db-server-01 (WinDomain)</option>
                <option value="demo-003">svc-api @ api-server-01 (UnixSSH)</option>
                <option value="demo-004">svc-backup @ backup-server (WinServerLocal)</option>
                <option value="demo-005">admin-portal @ mgmt-server-01 (WinDomain)</option>
              </select>

              <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:6px;">USER ID</div>
              <input id="jit-user" value="demo-admin" style="width:100%;padding:8px 10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;color:var(--text-bright);font-size:0.78rem;margin-bottom:12px;">

              <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:6px;">BUSINESS JUSTIFICATION</div>
              <input id="jit-reason" value="Emergency access — incident #INC-4821" style="width:100%;padding:8px 10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;color:var(--text-bright);font-size:0.78rem;margin-bottom:16px;">

              <button onclick="jitStart()" style="width:100%;padding:10px;background:var(--green);color:#000;font-weight:700;font-size:0.82rem;border:none;border-radius:6px;cursor:pointer;transition:opacity 0.2s;" onmouseover="this.style.opacity=0.85" onmouseout="this.style.opacity=1">
                &#x25B6; Start Privileged Session
              </button>
            </div>

            <!-- Phase 2: Active session -->
            <div id="jit-active" style="display:none;">

              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <div>
                  <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;">SESSION ID</div>
                  <div id="jit-session-id" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);"></div>
                </div>
                <span id="jit-status-badge" class="badge badge-green">ACTIVE</span>
              </div>

              <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:4px;">ACCOUNT</div>
              <div id="jit-account-name" style="font-size:0.82rem;font-weight:600;color:var(--text-bright);margin-bottom:14px;"></div>

              <!-- Credential display -->
              <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;padding:12px 14px;margin-bottom:14px;">
                <div style="font-size:0.58rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:6px;">INJECTED CREDENTIAL</div>
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="flex:1;">
                    <div id="jit-cred-old" style="font-family:var(--font-mono);font-size:1rem;color:var(--text-bright);letter-spacing:0.08em;transition:all 0.4s;"></div>
                    <div id="jit-cred-new" style="display:none;font-family:var(--font-mono);font-size:1rem;color:var(--green);letter-spacing:0.08em;margin-top:4px;"></div>
                  </div>
                  <div style="text-align:right;">
                    <div id="jit-vault-label" style="font-size:0.6rem;font-family:var(--font-mono);color:var(--blue);">⬡ CyberArk Vault</div>
                    <div id="jit-cred-status" style="font-size:0.58rem;font-family:var(--font-mono);color:var(--text-muted);">ACTIVE</div>
                  </div>
                </div>
              </div>

              <!-- Timer -->
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);">SESSION DURATION</div>
                <div id="jit-timer" style="font-family:var(--font-mono);font-size:0.82rem;color:var(--text-bright);">00:00:00</div>
              </div>

              <!-- Rotation progress (hidden until end) -->
              <div id="jit-rotation-wrap" style="display:none;margin-bottom:14px;">
                <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:6px;">
                  <div id="jit-progress-fill" style="height:100%;width:0%;background:var(--blue);border-radius:3px;transition:width 0.6s ease;"></div>
                </div>
                <div id="jit-progress-msg" style="font-size:0.68rem;color:var(--text-muted);font-family:var(--font-mono);"></div>
              </div>

              <!-- Buttons -->
              <div style="display:flex;gap:8px;">
                <button id="jit-end-btn" onclick="jitEnd()" style="flex:1;padding:9px;background:var(--red);color:#fff;font-weight:700;font-size:0.78rem;border:none;border-radius:6px;cursor:pointer;transition:opacity 0.2s;" onmouseover="this.style.opacity=0.85" onmouseout="this.style.opacity=1">
                  &#x23F9; End Session &amp; Rotate Secret
                </button>
                <button onclick="jitReset()" style="padding:9px 14px;background:var(--bg-surface);border:1px solid var(--border);color:var(--text-muted);font-size:0.78rem;border-radius:6px;cursor:pointer;" title="Reset demo">&#x21BA;</button>
              </div>
            </div>
          </div>

          <!-- RIGHT: audit log -->
          <div>
            <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:10px;">SESSION AUDIT LOG</div>
            <div id="jit-log" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;padding:10px 12px;min-height:260px;max-height:360px;overflow-y:auto;">
              <div style="color:var(--text-muted);font-size:0.68rem;font-style:italic;padding:8px 0;">Start a session to see audit events...</div>
            </div>
          </div>

        </div><!-- /grid -->

        <!-- How it works callout -->
        <div class="callout teal" style="margin-top:20px;font-size:0.68rem;line-height:1.7;">
          <div class="callout-title">How This Works in Production</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px;">
            <div><strong style="color:var(--teal);">1. Session Start</strong><br>User identity verified → CyberArk AAM/CCP API called → credential injected into session context → audit log entry written with SHA-256 hash.</div>
            <div><strong style="color:var(--teal);">2. Session Active</strong><br>Credential is masked in all UI surfaces. Only the target system receives the raw value. CPM tracks the account as "checked out" — dual-control enforced.</div>
            <div><strong style="color:var(--teal);">3. Session End → Rotation</strong><br>Check-in triggers <code>POST /Accounts/{id}/Change</code> → CPM generates new credential → vault updated → old value invalidated within seconds.</div>
          </div>
        </div>

      </div><!-- /panel-body -->
    </div><!-- /panel -->

  </div><!-- /lab-panel-jit -->

  <!-- ══ Tab 2: Credential Types ══ -->
  <div id="lab-panel-creds" style="display:none;"></div>

  <!-- ══ Tab 3: Oracle DB Workflow ══ -->
  <div id="lab-panel-oracle" style="display:none;"></div>

  <!-- ══ Tab 4: Connector Comparison ══ -->
  <div id="lab-panel-connectors" style="display:none;"></div>

  <!-- ══ Tab 5: Identity Transform ══ -->
  <div id="lab-panel-identity" style="display:none;"></div>

  `;

  renderCredentialTypes();
  renderOracleWorkflow();
  renderConnectorComparison();
  renderIdentityTransform();
  _labSwitchTab(_labTab);
}

function renderCredentialTypes() {
  const el = document.getElementById('lab-panel-creds');
  if (!el) return;

  const cardStyle = (accent) =>
    `background:var(--bg-surface);border:1px solid var(--border);border-top:3px solid ${accent};border-radius:8px;padding:18px;`;

  const badgeStyle = (bg, color) =>
    `background:${bg};color:${color};font-family:var(--font-mono);font-size:0.55rem;padding:2px 7px;border-radius:3px;`;

  const fieldRow = (label, value) => `
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:5px 0;border-bottom:1px solid var(--border);font-size:0.72rem;">
      <span style="font-family:var(--font-mono);color:var(--text-muted);font-size:0.62rem;letter-spacing:0.04em;">${label}</span>
      <span style="color:var(--text-standard);text-align:right;max-width:60%;">${value}</span>
    </div>`;

  const useCasesList = (items) => items.map(i => `<li>${i}</li>`).join('');

  const riskBadge = (label, bg, color) =>
    `<div style="margin-top:14px;">
      <span style="background:${bg};color:${color};font-family:var(--font-mono);font-size:0.6rem;padding:3px 9px;border-radius:3px;font-weight:700;">${label}</span>
    </div>`;

  el.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">&#x1F4CB; Credential Models &mdash; Dedicated &middot; Shared &middot; ZSP / JIT</div>
      </div>
      <div class="panel-body" style="padding:20px;">

        <!-- ── Three credential cards ── -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px;">

          <!-- Card 1: Dedicated -->
          <div style="${cardStyle('var(--green)')}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="${badgeStyle('var(--green-dim)', 'var(--green)')}">DEDICATED</span>
              <span style="font-size:1.1rem;">&#x1F512;</span>
            </div>
            <div style="font-weight:700;font-size:0.88rem;margin:10px 0 6px;color:var(--text-bright);">Dedicated Credential</div>
            <div style="font-size:0.72rem;color:var(--text-standard);line-height:1.6;margin-bottom:12px;">
              One credential bound to one person or service. No sharing. Individually tracked, rotated, and audited.
            </div>
            ${fieldRow('BOUND TO', 'svc-webportal @ web-server-01')}
            ${fieldRow('ROTATION', 'Every 30 days / on session end')}
            ${fieldRow('AUDIT TRAIL', 'Full individual history')}
            ${fieldRow('CHECKOUT', 'Single user at a time')}
            <div style="margin-top:12px;">
              <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:0.05em;margin-bottom:6px;">USE CASES</div>
              <ul style="font-size:0.72rem;color:var(--text-standard);line-height:1.7;padding-left:16px;margin:0;">
                ${useCasesList(['Human privileged admins', 'Service accounts with compliance requirements', 'Break-glass accounts'])}
              </ul>
            </div>
            ${riskBadge('LOW RISK', 'var(--green-dim)', 'var(--green)')}
          </div>

          <!-- Card 2: Shared -->
          <div style="${cardStyle('var(--amber)')}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="${badgeStyle('var(--amber-dim)', 'var(--amber)')}">SHARED</span>
              <span style="font-size:1.1rem;">&#x1F465;</span>
            </div>
            <div style="font-weight:700;font-size:0.88rem;margin:10px 0 6px;color:var(--text-bright);">Shared Credential</div>
            <div style="font-size:0.72rem;color:var(--text-standard);line-height:1.6;margin-bottom:12px;">
              One credential used by multiple people or services. Simpler to manage but requires tighter session controls.
            </div>
            ${fieldRow('BOUND TO', 'db-admin @ shared-pool-1')}
            ${fieldRow('ROTATION', 'On each checkout return')}
            ${fieldRow('AUDIT TRAIL', 'Session-level (who / when)')}
            ${fieldRow('CHECKOUT', 'Dual control / time-limited')}
            <div style="margin-top:12px;">
              <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:0.05em;margin-bottom:6px;">USE CASES</div>
              <ul style="font-size:0.72rem;color:var(--text-standard);line-height:1.7;padding-left:16px;margin:0;">
                ${useCasesList(['Shared service accounts', 'Legacy apps that cannot support individual credentials', 'Emergency break-glass pools'])}
              </ul>
            </div>
            ${riskBadge('MEDIUM RISK', 'var(--amber-dim)', 'var(--amber)')}
          </div>

          <!-- Card 3: ZSP / JIT -->
          <div style="${cardStyle('var(--blue)')}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="${badgeStyle('var(--blue-dim)', 'var(--blue)')}">ZERO STANDING PRIVILEGE</span>
              <span style="font-size:1.1rem;">&#x26A1;</span>
            </div>
            <div style="font-weight:700;font-size:0.88rem;margin:10px 0 6px;color:var(--text-bright);">ZSP / JIT Ephemeral</div>
            <div style="font-size:0.72rem;color:var(--text-standard);line-height:1.6;margin-bottom:12px;">
              No credential exists at rest. Created on-demand for the session duration, then immediately destroyed or rotated.
            </div>
            ${fieldRow('BOUND TO', 'Ephemeral &mdash; created per request')}
            ${fieldRow('ROTATION', 'Immediate post-session')}
            ${fieldRow('AUDIT TRAIL', 'Full session recording')}
            ${fieldRow('CHECKOUT', 'Auto-expires (TTL enforced)')}
            <div style="margin-top:12px;">
              <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:0.05em;margin-bottom:6px;">USE CASES</div>
              <ul style="font-size:0.72rem;color:var(--text-standard);line-height:1.7;padding-left:16px;margin:0;">
                ${useCasesList(['Just-In-Time access', 'Cloud workload identities', 'High-security environments (PCI / SOX zones)'])}
              </ul>
            </div>
            ${riskBadge('LOWEST RISK', 'var(--green-dim)', 'var(--green)')}
          </div>

        </div><!-- /card grid -->

        <!-- ── Comparison table ── -->
        <table class="compare-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Dedicated</th>
              <th>Shared</th>
              <th>ZSP / JIT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standing credential exists?</td>
              <td class="risk-low">Yes</td>
              <td class="risk-medium">Yes</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Simultaneous users</td>
              <td class="risk-low">1</td>
              <td class="risk-medium">Multiple</td>
              <td>1 (ephemeral)</td>
            </tr>
            <tr>
              <td>Rotation trigger</td>
              <td class="risk-low">Schedule / session end</td>
              <td class="risk-medium">Per checkout return</td>
              <td>Always post-session</td>
            </tr>
            <tr>
              <td>Blast radius if leaked</td>
              <td class="risk-low">Low &mdash; one account</td>
              <td class="risk-medium">High &mdash; all users</td>
              <td>Near-zero &mdash; expired</td>
            </tr>
            <tr>
              <td>Compliance best practice</td>
              <td class="risk-low">Yes</td>
              <td class="risk-medium">Conditional</td>
              <td>Gold standard</td>
            </tr>
            <tr>
              <td>Migration complexity</td>
              <td class="risk-low">Low</td>
              <td class="risk-medium">Medium</td>
              <td>High (workflow rebuild required)</td>
            </tr>
          </tbody>
        </table>

        <!-- ── What SHIFT Migrates callout ── -->
        <div class="callout teal" style="margin-top:20px;font-size:0.72rem;line-height:1.7;">
          <div class="callout-title">What SHIFT Migrates</div>
          SHIFT migrates Dedicated credentials 1:1. Shared credentials are flagged for rationalization &mdash;
          each should become Dedicated or ZSP where possible. ZSP/JIT patterns require new workflow configuration
          in the target PAM platform and are out of scope for automated ETL but are documented in the migration runbook.
        </div>

      </div><!-- /panel-body -->
    </div><!-- /panel -->
  `;
}
function renderOracleWorkflow() {
  const el = document.getElementById('lab-panel-oracle');
  if (!el) return;
  el.innerHTML = `
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-header">
        <div class="panel-title">&#x1F4CA; Oracle DB — CorePAS Privileged Access Workflow</div>
        <span style="font-size:0.6rem;color:var(--text-muted);font-family:var(--font-mono);">7 STEPS · CLICK-THROUGH</span>
      </div>
      <div class="panel-body" style="padding:20px;">

        <!-- Breadcrumb -->
        <div id="oracle-breadcrumb" style="display:flex;gap:6px;align-items:center;margin-bottom:20px;flex-wrap:wrap;"></div>

        <!-- Stage -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
          <div>
            <div id="oracle-step-title" style="font-size:0.78rem;font-weight:700;color:var(--text-bright);margin-bottom:12px;"></div>
            <div id="oracle-stage" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:8px;padding:16px;min-height:160px;"></div>
          </div>
          <div>
            <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1.5px;margin-bottom:8px;">ACTIVE CONNECTOR</div>
            <div id="oracle-connector-box" style="background:var(--bg-surface);border:1px solid var(--teal);border-radius:8px;padding:14px;min-height:160px;"></div>
          </div>
        </div>

        <!-- Controls -->
        <div style="display:flex;gap:10px;align-items:center;">
          <button id="oracle-prev-btn" onclick="_oraclePrev()" style="padding:8px 16px;background:var(--bg-surface);border:1px solid var(--border);color:var(--text-muted);font-size:0.78rem;border-radius:6px;cursor:pointer;">&#x276E; Previous</button>
          <button id="oracle-next-btn" onclick="_oracleNext()" style="padding:8px 20px;background:var(--teal);color:#000;font-weight:700;font-size:0.78rem;border:none;border-radius:6px;cursor:pointer;">Next Step &#x276F;</button>
          <span id="oracle-step-counter" style="font-size:0.68rem;font-family:var(--font-mono);color:var(--text-muted);margin-left:auto;"></span>
          <button onclick="_oracleReset()" style="padding:6px 12px;background:transparent;border:none;color:var(--text-muted);font-size:0.72rem;cursor:pointer;text-decoration:underline;">Restart</button>
        </div>

      </div>
    </div>
  `;
  _oracleRender();
}

function _oracleRender() {
  const s = _oracleStep;
  const step = ORACLE_STEPS[s];

  // Breadcrumb
  const bc = document.getElementById('oracle-breadcrumb');
  if (bc) {
    bc.innerHTML = ORACLE_STEPS.map((st, i) => {
      let bg, color, border;
      if (i < s) { bg = 'var(--green-dim)'; color = 'var(--green)'; border = '1px solid var(--green)'; }
      else if (i === s) { bg = 'var(--teal)'; color = '#000'; border = '1px solid var(--teal)'; }
      else { bg = 'var(--bg-surface)'; color = 'var(--text-muted)'; border = '1px solid var(--border)'; }
      return `<div onclick="_oracleGoTo(${i})" style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;font-family:var(--font-mono);cursor:pointer;background:${bg};color:${color};border:${border};flex-shrink:0;">${i+1}</div>
      ${i < ORACLE_STEPS.length-1 ? `<div style="flex:1;height:1px;background:var(--border);min-width:8px;"></div>` : ''}`;
    }).join('');
  }

  // Step title
  const titleEl = document.getElementById('oracle-step-title');
  if (titleEl) titleEl.textContent = `Step ${s+1}: ${step.title}`;

  // Stage content
  const stageEl = document.getElementById('oracle-stage');
  if (stageEl) stageEl.innerHTML = step.stageHtml;

  // Connector box
  const connEl = document.getElementById('oracle-connector-box');
  if (connEl) {
    const c = ORACLE_CONNECTORS[s];
    if (!c) {
      connEl.innerHTML = `<div style="color:var(--text-muted);font-size:0.72rem;font-style:italic;">No active connector at this step.</div>`;
    } else {
      connEl.innerHTML = `
        <div style="font-size:0.78rem;font-weight:700;color:var(--teal);margin-bottom:10px;">${c.name}</div>
        <div style="margin-bottom:8px;">
          <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1px;margin-bottom:3px;">LEGACY CYBERARK</div>
          <div style="font-size:0.7rem;color:var(--text-standard);">${c.legacy}</div>
        </div>
        <div>
          <div style="font-size:0.6rem;font-family:var(--font-mono);color:var(--text-muted);letter-spacing:1px;margin-bottom:3px;">TARGET PAM</div>
          <div style="font-size:0.7rem;color:var(--green);">${c.target}</div>
        </div>`;
    }
  }

  // Counter
  const counter = document.getElementById('oracle-step-counter');
  if (counter) counter.textContent = `Step ${s+1} of ${ORACLE_STEPS.length}`;

  // Button states
  const prevBtn = document.getElementById('oracle-prev-btn');
  const nextBtn = document.getElementById('oracle-next-btn');
  if (prevBtn) prevBtn.disabled = s === 0;
  if (nextBtn) {
    nextBtn.disabled = s === ORACLE_STEPS.length - 1;
    nextBtn.textContent = s === ORACLE_STEPS.length - 2 ? 'Final Step \u203a' : 'Next Step \u203a';
  }
}

function _oracleNext()     { if (_oracleStep < ORACLE_STEPS.length - 1) { _oracleStep++; _oracleRender(); } }
function _oraclePrev()     { if (_oracleStep > 0) { _oracleStep--; _oracleRender(); } }
function _oracleGoTo(n)    { _oracleStep = n; _oracleRender(); }
function _oracleReset()    { _oracleStep = 0; _oracleRender(); }

function _oracleRunRotation() {
  const btn = document.getElementById('oracle-rotate-btn');
  if (btn) btn.disabled = true;

  const setProgress = (pct, msg) => {
    const f = document.getElementById('oracle-progress-fill');
    const m = document.getElementById('oracle-progress-msg');
    if (f) f.style.width = pct + '%';
    if (m) m.textContent = msg;
  };

  setProgress(5, 'Initiating CPM rotation\u2026');
  setTimeout(() => setProgress(25, 'Generating new credential\u2026'), 800);
  setTimeout(() => setProgress(55, 'Pushing to vault\u2026'), 1600);
  setTimeout(() => setProgress(85, 'Validating rotation\u2026'), 2400);
  setTimeout(() => {
    setProgress(100, 'Credential rotated successfully \u2713');
    const oldEl = document.getElementById('oracle-cred-old');
    if (oldEl) { oldEl.style.textDecoration = 'line-through'; oldEl.style.color = 'var(--red)'; }
    const newEl = document.getElementById('oracle-cred-new');
    if (newEl) { newEl.textContent = 'Xm9r\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20222kYd'; newEl.style.display = 'block'; }
  }, 3200);
}

function renderConnectorComparison() { /* Task 4 */ }
function renderIdentityTransform() { /* Task 5 */ }

// ── Simulation functions ──────────────────────────────────

function jitStart() {
  const accountSel = document.getElementById('jit-account');
  const accountName = accountSel.options[accountSel.selectedIndex].text;

  _jit.sessionId  = 'SESS-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  _jit.accountName = accountName;
  _jit.maskedSecret = _jitMask(_jitGenPw());
  _jit.elapsed = 0;

  // Switch phases
  document.getElementById('jit-setup').style.display  = 'none';
  document.getElementById('jit-active').style.display = 'block';

  // Populate
  document.getElementById('jit-session-id').textContent  = _jit.sessionId;
  document.getElementById('jit-account-name').textContent = _jit.accountName;
  document.getElementById('jit-cred-old').textContent     = _jit.maskedSecret;
  document.getElementById('jit-cred-old').style.textDecoration = 'none';
  document.getElementById('jit-cred-old').style.color    = 'var(--text-bright)';
  document.getElementById('jit-cred-new').style.display  = 'none';
  document.getElementById('jit-vault-label').textContent  = '⬡ CyberArk Vault';
  document.getElementById('jit-vault-label').style.color  = 'var(--blue)';
  document.getElementById('jit-cred-status').textContent  = 'ACTIVE';
  document.getElementById('jit-cred-status').style.color  = 'var(--green)';
  document.getElementById('jit-rotation-wrap').style.display = 'none';
  document.getElementById('jit-progress-fill').style.width   = '0%';
  document.getElementById('jit-progress-msg').textContent    = '';
  document.getElementById('jit-end-btn').disabled = false;
  _jitBadge('ACTIVE', 'badge-green');

  // Timer
  clearInterval(_jit.timer);
  _jit.timer = setInterval(() => {
    _jit.elapsed++;
    const h = String(Math.floor(_jit.elapsed / 3600)).padStart(2,'0');
    const m = String(Math.floor((_jit.elapsed % 3600) / 60)).padStart(2,'0');
    const s = String(_jit.elapsed % 60).padStart(2,'0');
    const el = document.getElementById('jit-timer');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }, 1000);

  // Clear + populate log
  const log = document.getElementById('jit-log');
  log.innerHTML = '';
  _jitLog('SESSION_STARTED',       `Session ${_jit.sessionId} started for ${_jit.accountName}`);
  _jitLog('CREDENTIAL_INJECTED',   `Secret retrieved from CyberArk vault \u2192 ${_jit.maskedSecret}`);
}

function jitEnd() {
  document.getElementById('jit-end-btn').disabled = true;
  document.getElementById('jit-rotation-wrap').style.display = 'block';
  clearInterval(_jit.timer);
  _jitBadge('ROTATING', 'badge-amber');

  _jitLog('ROTATION_STARTING', 'CPM rotation initiated — account checked in');
  _jitProg(5, 'Initiating CPM rotation\u2026');

  setTimeout(() => { _jitLog('ROTATION_PROGRESS', 'Generating new credential\u2026');   _jitProg(25, 'Generating new credential\u2026'); },   800);
  setTimeout(() => { _jitLog('ROTATION_PROGRESS', 'Pushing to vault\u2026');            _jitProg(55, 'Pushing to vault\u2026'); },            1600);
  setTimeout(() => { _jitLog('ROTATION_PROGRESS', 'Validating rotation\u2026');         _jitProg(85, 'Validating rotation\u2026'); },         2400);

  setTimeout(() => {
    const newMasked = _jitMask(_jitGenPw());

    _jitProg(100, 'Credential rotated successfully \u2713');
    _jitLog('ROTATION_COMPLETE', `New credential issued \u2192 ${newMasked}`);

    // Strike old, reveal new
    const oldEl = document.getElementById('jit-cred-old');
    oldEl.style.textDecoration = 'line-through';
    oldEl.style.color = 'var(--red)';

    const newEl = document.getElementById('jit-cred-new');
    newEl.textContent = newMasked;
    newEl.style.display = 'block';

    document.getElementById('jit-vault-label').textContent = '⬡ CyberArk Vault (Rotated)';
    document.getElementById('jit-vault-label').style.color = 'var(--green)';
    document.getElementById('jit-cred-status').textContent = 'ROTATED \u2014 INVALID';
    document.getElementById('jit-cred-status').style.color = 'var(--red)';

    _jitBadge('ENDED', 'badge-muted');

    setTimeout(() => _jitLog('SESSION_ENDED', 'Session closed. Old credential is now invalid.'), 200);
  }, 3200);
}

function jitReset() {
  clearInterval(_jit.timer);
  _jit = { sessionId:null, accountName:null, maskedSecret:null, timer:null, elapsed:0 };
  document.getElementById('jit-setup').style.display  = 'block';
  document.getElementById('jit-active').style.display = 'none';
  document.getElementById('jit-log').innerHTML =
    '<div style="color:var(--text-muted);font-size:0.68rem;font-style:italic;padding:8px 0;">Start a session to see audit events...</div>';
}

// ── Helpers ───────────────────────────────────────────────

function _jitGenPw() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let pw = '';
  for (let i = 0; i < 20; i++) pw += c[Math.floor(Math.random() * c.length)];
  return pw;
}

function _jitMask(pw) {
  if (!pw || pw.length < 10) return '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
  return pw.slice(0, 4) + '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' + pw.slice(-4);
}

function _jitProg(pct, msg) {
  const f = document.getElementById('jit-progress-fill');
  const m = document.getElementById('jit-progress-msg');
  if (f) f.style.width = pct + '%';
  if (m) m.textContent = msg;
}

function _jitBadge(text, cls) {
  const b = document.getElementById('jit-status-badge');
  if (!b) return;
  b.textContent = text;
  b.className = 'badge ' + cls;
}

function _jitLog(type, message) {
  const container = document.getElementById('jit-log');
  if (!container) return;
  const now = new Date().toISOString().replace('T',' ').substring(0,19);
  const colors = {
    SESSION_STARTED:    'var(--blue)',
    CREDENTIAL_INJECTED:'var(--green)',
    ROTATION_STARTING:  'var(--amber)',
    ROTATION_PROGRESS:  'var(--amber)',
    ROTATION_COMPLETE:  'var(--green)',
    SESSION_ENDED:      'var(--text-muted)',
    ERROR:              'var(--red)',
  };
  const div = document.createElement('div');
  div.style.cssText = 'padding:5px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;font-size:0.68rem;';
  div.innerHTML = `
    <span style="color:var(--text-muted);font-family:var(--font-mono);white-space:nowrap;flex-shrink:0;">${now}</span>
    <span style="font-weight:700;min-width:9.5rem;flex-shrink:0;color:${colors[type]||'var(--text-standard)'};">${type}</span>
    <span style="color:var(--text-standard);">${message}</span>`;
  // Remove placeholder text on first entry
  if (container.querySelector('div[style*="italic"]')) container.innerHTML = '';
  container.insertBefore(div, container.firstChild);
}
