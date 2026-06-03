// VERSION: 3.4.0-BUTTON-FIX
(function() {
    // Persistent state across navigations
    window.__INCODE_CHAT_STATE = window.__INCODE_CHAT_STATE || {
        initialized: false,
        isOpen: false,
        turnstileToken: null,
        turnstileWidgetId: null,
        sessionId: null,
        leadInfo: null,
        idleTimer: null,
        warningTimer: null,
        practiceLocations: [],
        greetingMessage: "Halo! Ada yang bisa saya bantu?",
        tenantId: null,
        apiUrl: null,
        turnstileSiteKey: null,
        customBottom: null
    };

    const state = window.__INCODE_CHAT_STATE;

    function initChatWidget() {
        console.log('Chat Widget: Initializing Version 3.3.0-CONTRAST-FIX...');
        
        // 1. Configuration (Robust lookup & caching to handle SPA page routing and dynamic script mounts)
        let tenantId = state.tenantId;
        let apiUrl = state.apiUrl;
        let turnstileSiteKey = state.turnstileSiteKey;
        let customBottom = state.customBottom;

        const script = document.currentScript || 
                       Array.from(document.getElementsByTagName('script')).find(s => s.src.includes('chat-widget.js') || s.getAttribute('data-tenant-id'));
        
        if (script) {
            tenantId = script.getAttribute('data-tenant-id') || tenantId;
            apiUrl = script.getAttribute('data-api-url') || apiUrl || 'https://cloudflare-ai-chatbot.eka-prasaja.workers.dev';
            turnstileSiteKey = script.getAttribute('data-site-key') || turnstileSiteKey || '0x4AAAAAADLH-shsyjvDfhj8';
            customBottom = script.getAttribute('data-bottom') || customBottom || '24px';
            
            // Cache config values in persistent cross-navigation state
            state.tenantId = tenantId;
            state.apiUrl = apiUrl;
            state.turnstileSiteKey = turnstileSiteKey;
            state.customBottom = customBottom;
        }

        if (!tenantId) {
            console.error('Chat Widget: Critical configuration failure. data-tenant-id is missing and could not be recovered.');
            return;
        }

        const customTimeoutMin = script ? script.getAttribute('data-idle-timeout-min') : null;
        const timeoutMinutes = customTimeoutMin ? parseFloat(customTimeoutMin) : 15;
        const timeoutMs = timeoutMinutes * 60 * 1000;
        customBottom = customBottom || '24px';

        // Check passive timeout (15 minutes of inactivity)
        const lastActiveTime = localStorage.getItem(`ai_chat_lat_${tenantId}`);
        const now = Date.now();
        if (lastActiveTime && (now - parseInt(lastActiveTime, 10)) > timeoutMs) {
            console.log(`Chat Widget: Passive timeout exceeded (> ${timeoutMinutes} min). Resetting session and wiping lead for privacy.`);
            state.sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
            sessionStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
            
            // Clear lead info on passive timeout
            state.leadInfo = null;
            localStorage.removeItem(`ai_chat_lead_${tenantId}`);
            sessionStorage.removeItem(`ai_chat_lead_${tenantId}`);
        }

        if (!state.sessionId) {
            state.sessionId = sessionStorage.getItem(`ai_chat_sid_${tenantId}`) || localStorage.getItem(`ai_chat_sid_${tenantId}`) || ('sess_' + Math.random().toString(36).substring(2, 15));
            localStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
            sessionStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
        }

        localStorage.setItem(`ai_chat_lat_${tenantId}`, now.toString());

        // Check for existing lead info
        if (!state.leadInfo) {
            const savedLead = sessionStorage.getItem(`ai_chat_lead_${tenantId}`) || localStorage.getItem(`ai_chat_lead_${tenantId}`);
            if (savedLead) {
                try {
                    state.leadInfo = JSON.parse(savedLead);
                } catch (e) {
                    console.error('Chat Widget: Error parsing lead info', e);
                }
            }
        }

        // 2. Load Dependencies (Only once)
        if (!state.initialized) {
            console.log('Chat Widget: Loading dependencies...');
            const deps = [
                ['https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js', 'incode-anime'],
                ['https://unpkg.com/lucide@latest/dist/umd/lucide.min.js', 'incode-lucide'],
                ['https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', 'incode-turnstile']
            ];
            deps.forEach(([src, id]) => {
                if (!document.getElementById(id)) {
                    const s = document.createElement('script');
                    s.src = src; s.id = id; s.async = true;
                    s.crossOrigin = 'anonymous'; // Opt-in to CORS to satisfy strict COEP/CORP policies
                    document.head.appendChild(s);
                }
            });
            state.initialized = true;
        }

        let container = document.getElementById('ai-chat-widget-container');
        if (container) container.remove(); 

        container = document.createElement('div');
        container.id = 'ai-chat-widget-container';
        container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; pointer-events: none;';
        document.body.appendChild(container);

        let tsContainer = document.getElementById('ai-chat-turnstile-container');
        if (!tsContainer) {
            tsContainer = document.createElement('div');
            tsContainer.id = 'ai-chat-turnstile-container';
            tsContainer.style.cssText = 'position:fixed;top:-2000px;left:-2000px;width:300px;height:65px;z-index:-9999;pointer-events:none;';
            document.body.appendChild(tsContainer);
        }

        const shadow = container;
        shadow.getElementById = function(id) {
            return document.getElementById(id);
        };

        // 4. UI Rendering
        const style = document.createElement('style');
        style.textContent = `
            #ai-chat-widget-container {
  --incode-primary-color: #6366f1;
  --incode-bg-color: #ffffff;
  --incode-text-color: #111827;
  --incode-icon-color: #ffffff;
  font-family: 'Inter', sans-serif;
}
@media (prefers-color-scheme: dark) {
  #ai-chat-widget-container {
    --incode-primary-color: #8b5cf6;
    --incode-bg-color: #1a1a1a;
    --incode-text-color: #f5f5f5;
    --incode-icon-color: #f5f5f5;
  }
}
            #widget-trigger { position: absolute; bottom: ${customBottom}; right: 24px; width: 60px; height: 60px; border-radius: 30px; background: var(--incode-primary-color); box-shadow: 0 4px 20px color-mix(in srgb, var(--incode-primary-color) 40%, transparent); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9999; color: white; transition: transform 0.2s, opacity 0.2s; pointer-events: auto; }
            #widget-trigger:hover { transform: scale(1.05); }
            #widget-trigger:active { transform: scale(0.95); }
            #chat-window { position: absolute; bottom: calc(${customBottom} + 76px); right: 24px; width: 380px; height: 600px; max-height: 80vh; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.3); border-radius: 24px; box-shadow: 0 10px 45px rgba(0,0,0,0.12); display: none; flex-direction: column; overflow: hidden; z-index: 9998; opacity: 0; transform: translateY(20px); transition: opacity 0.3s, transform 0.3s; pointer-events: auto; }
            #chat-window.open { display: flex !important; }
            #chat-header { padding: 20px; background: var(--incode-primary-color); color: white; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); }
            #chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
            
            /* Elastic bubble animations */
            .message { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-wrap: break-word; animation: incode-bubble-in 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.25) both; transform-origin: bottom right; }
            .message.user { align-self: flex-end; background: var(--incode-primary-color); color: white; border-bottom-right-radius: 4px; box-shadow: 0 4px 12px color-mix(in srgb, var(--incode-primary-color) 20%, transparent); }
            .message.ai { align-self: flex-start; background: rgba(243, 244, 246, 0.95); color: #1f2937; border-bottom-left-radius: 4px; border: 1px solid rgba(0,0,0,0.03); transform-origin: bottom left; }
            @keyframes incode-bubble-in {
                0% { opacity: 0; transform: scale(0.7) translateY(12px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }

            #chat-input-container { padding: 16px; border-top: 1px solid #e5e7eb; display: flex; gap: 10px; background: rgba(255,255,255,0.5); }
            #chat-input { flex: 1; border: 1px solid #d1d5db !important; background: #ffffff !important; padding: 10px 16px; border-radius: 12px; outline: none; font-size: 14px; transition: border-color 0.2s; color: #111827 !important; }
            #chat-input::placeholder { color: #6b7280 !important; }
            #chat-input:focus { border-color: var(--incode-primary-color) !important; }
            #send-btn { background: var(--incode-primary-color); color: white; border: none; padding: 10px; border-radius: 12px; cursor: pointer; transition: transform 0.2s, filter 0.2s; display: flex; align-items: center; justify-content: center; }
            #send-btn:hover { filter: brightness(1.1); transform: scale(1.05); }
            #send-btn:active { transform: scale(0.95); }
            
            /* Quick Start Pills styles */
            #quick-pills-container { display: flex; gap: 8px; padding: 10px 20px; overflow-x: auto; white-space: nowrap; scrollbar-width: none; background: rgba(255,255,255,0.4); border-top: 1px solid rgba(0,0,0,0.03); }
            #quick-pills-container::-webkit-scrollbar { display: none; }
            .quick-pill { display: inline-block; padding: 8px 16px; background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 20px; font-size: 12px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.2s ease-in-out; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
            .quick-pill:hover { background: var(--incode-primary-color); color: #ffffff; border-color: var(--incode-primary-color); transform: translateY(-1px); }
            .quick-pill:active { transform: translateY(0); }

            /* Scroll-to-bottom button */
            #scroll-down-btn { position: absolute; bottom: 85px; right: 20px; width: 38px; height: 38px; border-radius: 50%; background: #ffffff; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: none; align-items: center; justify-content: center; cursor: pointer; z-index: 1002; color: #374151; transition: all 0.2s, display 0s; }
            #scroll-down-btn:hover { transform: translateY(-2px); color: var(--incode-primary-color); }
            #scroll-down-btn.visible { display: flex; }
            #scroll-down-badge { position: absolute; top: -6px; right: -6px; background: #ef4444; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 10px; border: 1.5px solid #ffffff; animation: pulse-red 1.5s infinite; }
            @keyframes pulse-red {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }

            /* Locations Drawer Styles */
            #locations-drawer { position: absolute; bottom: 0; left: 0; right: 0; height: 75%; background: rgba(255,255,255,0.96); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(0,0,0,0.06); border-top-left-radius: 24px; border-top-right-radius: 24px; box-shadow: 0 -10px 40px rgba(0,0,0,0.1); z-index: 1005; display: none; flex-direction: column; overflow: hidden; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
            #locations-drawer.open { display: flex; transform: translateY(0); }
            #locations-drawer-header { padding: 18px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; background: rgba(249,250,251,0.8); }
            #locations-list-container { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
            .location-card { background: white; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s, box-shadow 0.2s; }
            .location-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.04); }
            .location-title { font-weight: 700; font-size: 14px; color: #1f2937; margin: 0; }
            .location-address { font-size: 12px; color: #4b5563; line-height: 1.4; margin: 0; }
            .location-hours { font-size: 12px; color: var(--incode-primary-color); font-weight: 600; margin: 0; display: flex; align-items: center; gap: 4px; }
            .location-map-btn { align-self: flex-start; font-size: 11px; font-weight: 600; color: var(--incode-primary-color); text-decoration: none; border: 1px solid var(--incode-primary-color); padding: 6px 12px; border-radius: 8px; margin-top: 4px; transition: all 0.2s; text-align: center; }
            .location-map-btn:hover { background: var(--incode-primary-color); color: white; }

            /* Lead Form Upgrades */
            #lead-form { position: absolute; inset: 0; background: #ffffff !important; z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
            .lead-input-wrapper { position: relative; width: 100%; margin-bottom: 14px; }
            .lead-input-wrapper .lead-icon { position: absolute; left: 14px; top: 13px; width: 16px; height: 16px; color: #4b5563 !important; pointer-events: none; z-index: 1; }
            .lead-input-wrapper .lead-valid-check { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; pointer-events: none; display: none; z-index: 1; }
            .lead-input-wrapper .lead-valid-check svg { width: 16px; height: 16px; }
            .lead-input-with-icon { width: 100%; padding: 12px 16px 12px 42px; border: 1.5px solid #d1d5db !important; border-radius: 12px; font-size: 14px; outline: none; box-sizing: border-box; transition: all 0.25s; color: #111827 !important; background-color: #ffffff !important; }
            .lead-input-with-icon::placeholder { color: #6b7280 !important; }
            .lead-input-with-icon:focus { border-color: var(--incode-primary-color) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--incode-primary-color) 15%, transparent) !important; }
            .lead-input-with-icon.valid { border-color: #10b981 !important; }
            .lead-input-with-icon.valid ~ .lead-valid-check { display: block; }
            .lead-input-with-icon.invalid { border-color: #ef4444 !important; }
            #start-chat-btn { width: 100%; padding: 12px; background: var(--incode-primary-color); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: not-allowed; opacity: 0.6; margin-top: 8px; transition: all 0.3s ease; }

            /* Warning Styles */
            #session-warning { position: absolute; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1001; display: none; align-items: center; justify-content: center; padding: 24px; opacity: 0; }
            .warning-card { background: white; padding: 28px 24px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); text-align: center; max-width: 280px; display: flex; flex-direction: column; align-items: center; transform: scale(0.95); }
            #extend-session-btn { width: 100%; padding: 12px; background: var(--incode-primary-color); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 13px; margin-top: 4px; transition: filter 0.2s; }
            #extend-session-btn:hover { filter: brightness(0.9); }
            
            /* Typing indicator keyframes */
            .incode-typing-indicator { display: flex; align-items: center; gap: 4px; padding: 6px 0; }
            .incode-typing-indicator span { width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; display: inline-block; animation: incode-bounce 1.4s infinite ease-in-out both; }
            .incode-typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .incode-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes incode-bounce {
                0%, 80%, 100% { transform: scale(0.3); }
                40% { transform: scale(1); }
            }

            /* Responsive Smartphone Native Rules */
            @media (max-width: 640px) {
                #chat-window.open {
                    bottom: 0 !important;
                    right: 0 !important;
                    width: 100vw !important;
                    height: 100% !important;
                    max-height: 100vh !important;
                    border-radius: 0 !important;
                    border: none !important;
                    z-index: 100000 !important;
                }
                #ai-chat-widget-container[data-open="true"] #widget-trigger {
                    display: none !important;
                }
                #chat-header {
                    padding: 16px 20px;
                }
                .message {
                    max-width: 85%;
                }
                #scroll-down-btn {
                    bottom: 95px;
                }
            }
        `;
        shadow.appendChild(style);

        const temp = document.createElement('div');
        temp.innerHTML = `
            <div id="widget-trigger" style="pointer-events: auto;"><i data-lucide="message-circle" id="trigger-icon"></i></div>
            <div id="chat-window" style="pointer-events: auto;">
                <div id="chat-header">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div id="bot-avatar-container" style="width:32px;height:32px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.2);position:relative;">
                            <i data-lucide="bot" id="bot-avatar-icon" style="width:18px;height:18px;"></i>
                            <div style="position:absolute;bottom:0;right:0;width:8px;height:8px;border-radius:50%;background:#10b981;border:1.5px solid var(--incode-primary-color);"></div>
                        </div>
                        <div><div id="bot-name" style="font-weight:600;">AI Assistant</div><div style="font-size:11px;opacity:0.8;">Online</div></div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div id="clear-chat-btn" style="cursor:pointer;opacity:0.8;transition:opacity 0.2s;display:flex;align-items:center;" title="Hapus Riwayat Chat"><i data-lucide="trash-2"></i></div>
                        <div id="toggle-locations-btn" style="cursor:pointer;display:none;width:18px;height:18px;align-items:center;" title="Jadwal & Lokasi Praktik"><i data-lucide="map-pin"></i></div>
                        <div id="close-chat" style="cursor:pointer;width:18px;height:18px;display:flex;align-items:center;" title="Tutup Chat"><i data-lucide="x"></i></div>
                    </div>
                </div>
                
                <div id="session-warning">
                    <div class="warning-card">
                        <i data-lucide="shield-alert" style="color:#eab308;width:36px;height:36px;margin-bottom:12px;"></i>
                        <h4 style="margin:0 0 8px 0;font-size:15px;font-weight:700;color:#1f2937;">Sesi Akan Berakhir</h4>
                        <p style="margin:0 0 16px 0;font-size:13px;color:#6b7280;line-height:1.4;">Demi privasi Anda, sesi ini akan berakhir dalam waktu kurang dari 2 menit karena tidak ada aktivitas. Ingin melanjutkan?</p>
                        <button id="extend-session-btn">Lanjutkan Percakapan</button>
                    </div>
                </div>

                <div id="locations-drawer">
                    <div id="locations-drawer-header">
                        <span id="locations-drawer-title" style="font-weight:700;font-size:14px;color:#1f2937;display:flex;align-items:center;gap:6px;"><i data-lucide="map-pin" style="width:16px;height:16px;color:var(--incode-primary-color);"></i> Lokasi & Jadwal Praktik</span>
                        <i data-lucide="chevron-down" id="close-locations-drawer" style="cursor:pointer;width:18px;height:18px;color:#6b7280;"></i>
                    </div>
                    <div id="locations-list-container"></div>
                </div>

                <div id="lead-form" style="display: ${state.leadInfo ? 'none' : 'flex'}">
                    <div style="width:64px;height:64px;background:color-mix(in srgb, var(--incode-primary-color) 10%, transparent);border-radius:20px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
                        <i data-lucide="user-plus" style="color:var(--incode-primary-color);width:32px;height:32px;"></i>
                    </div>
                    <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#111827 !important;">Welcome!</h3>
                    <p style="margin:0 0 24px 0;font-size:14px;color:#4b5563 !important;">Please introduce yourself to start the conversation.</p>
                    <div class="lead-input-wrapper">
                        <span class="lead-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                        <input type="text" id="lead-name" class="lead-input-with-icon" placeholder="Nama Lengkap" required autocomplete="name">
                        <span class="lead-valid-check"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.75l6 6 9-13.5"/></svg></span>
                    </div>
                    <div class="lead-input-wrapper">
                        <span class="lead-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
                        <input type="email" id="lead-email" class="lead-input-with-icon" placeholder="Alamat Email" required autocomplete="email">
                        <span class="lead-valid-check"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.75l6 6 9-13.5"/></svg></span>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 8px; text-align: left; margin: 8px 0 16px 0; width: 100%; pointer-events: auto;">
                        <input type="checkbox" id="gdpr-lead-consent" style="margin-top: 3px; cursor: pointer; pointer-events: auto;">
                        <label for="gdpr-lead-consent" style="font-size: 11px; color: #6b7280; line-height: 1.4; cursor: pointer; user-select: none;">
                            Saya menyetujui penyimpanan data pribadi dan pemrosesan riwayat chat asisten AI sesuai kebijakan GDPR.
                        </label>
                    </div>
                    <button id="start-chat-btn">Mulai Chatting</button>
                </div>

                <div id="chat-messages"><div class="message ai" id="initial-greeting">Halo! Ada yang bisa saya bantu?</div></div>
                
                <div id="scroll-down-btn">
                    <i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
                    <div id="scroll-down-badge" style="display:none;">1</div>
                </div>

                <div id="quick-pills-container" style="display:none;"></div>

                <div id="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Tulis pesan..." autocomplete="off">
                    <button id="send-btn"><i data-lucide="send" style="width:18px;"></i></button>
                </div>
            </div>
        `;
        while (temp.firstChild) {
            shadow.appendChild(temp.firstChild);
        }

        // Dynamic Quick Start Pills definition & rendering
        function isMedical(practiceType, botName) {
            const text = `${practiceType || ''} ${botName || ''}`.toLowerCase();
            if (!practiceType && !botName) return true;
            return text.includes('dokter') || text.includes('spesialis') || text.includes('klinik') || 
                   text.includes('medis') || text.includes('saraf') || text.includes('jantung') || 
                   text.includes('kandungan') || text.includes('mata') || text.includes('gigi') || 
                   text.includes('anak') || text.includes('orthoped') || text.includes('internist') ||
                   text.includes('cardiology') || text.includes('obgyn') || text.includes('ophthalmology') ||
                   text.includes('pediatric') || text.includes('health') || text.includes('medical') || 
                   text.includes('pasien') || text.includes('hnp') || text.includes('rs');
        }

        let defaultPills = ["🏥 Lokasi & Jadwal Praktik", "📅 Cara Buat Janji Temu", "🩺 Layanan Spesialisasi", "📞 Kontak Darurat"];
        const pillsContainer = shadow.getElementById('quick-pills-container');

        function renderQuickPills() {
            if (!pillsContainer) return;
            const messageCount = messagesContainer.querySelectorAll('.message').length;
            if (messageCount <= 1 && state.leadInfo) {
                pillsContainer.style.display = 'flex';
                pillsContainer.innerHTML = defaultPills.map(p => `<button class="quick-pill">${p}</button>`).join('');
                
                // Add click handlers for each pill
                const buttons = pillsContainer.querySelectorAll('.quick-pill');
                buttons.forEach(btn => {
                    btn.onclick = () => {
                        const pillText = btn.textContent.trim();
                        pillsContainer.style.display = 'none'; // Fade out instantly on click
                        sendMessage(pillText);
                    };
                });
            } else {
                pillsContainer.style.display = 'none';
            }
        }

        // Soft, highly satisfying chime synthesis using Web Audio API (cross-browser)
        function playNotificationSound() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                
                // Soft chime tone 1
                const osc1 = audioCtx.createOscillator();
                const gain1 = audioCtx.createGain();
                osc1.connect(gain1);
                gain1.connect(audioCtx.destination);
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
                gain1.gain.setValueAtTime(0, audioCtx.currentTime);
                gain1.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.05);
                gain1.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
                
                osc1.start(audioCtx.currentTime);
                osc1.stop(audioCtx.currentTime + 0.35);
                
                // Harmonious chime tone 2
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.08); // C#6
                gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.08);
                gain2.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.12);
                gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
                
                osc2.start(audioCtx.currentTime + 0.08);
                osc2.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
                console.warn('Chat Widget: Sound chime blocked or unsupported', e);
            }
        }

        // Function to helper-format personalized greeting dynamically
        function formatGreeting(rawGreeting, userName) {
            let msg = rawGreeting || "Halo! Ada yang bisa saya bantu?";
            const name = userName ? userName.trim() : "";
            if (!name) return msg;

            const greetingRegex = /^Halo\s*(!|,)?\s*/i;
            if (greetingRegex.test(msg)) {
                msg = msg.replace(greetingRegex, `Halo! ${name} `);
            } else {
                msg = `Halo! ${name} ` + msg;
            }
            return msg.replace(/\s+/g, ' ').trim();
        }

        // Centralized function to dynamically update and personalize initial greeting in the UI
        function updateGreetingUI() {
            const greetingEl = shadow.getElementById('initial-greeting');
            if (!greetingEl) return;
            const rawGreeting = state.greetingMessage || "Halo! Ada yang bisa saya bantu?";
            if (state.leadInfo && state.leadInfo.name) {
                greetingEl.textContent = formatGreeting(rawGreeting, state.leadInfo.name);
            } else {
                greetingEl.textContent = rawGreeting;
            }
        }


        // Fetch and apply dynamic styling & clinical locations config
        async function loadDynamicConfig() {
            try {
                const res = await fetch(`${apiUrl}/api/public/tenant-config?tenant_id=${tenantId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.themeColor) {
                        style.textContent = style.textContent.replace('--incode-primary-color: #6366f1', `--incode-primary-color: ${data.themeColor}`);
                    }
                    if (data.botName || data.name) {
                        const botNameEl = shadow.getElementById('bot-name');
                        if (botNameEl) botNameEl.textContent = data.botName || data.name;
                    }
                    if (data.greetingMessage) {
                        state.greetingMessage = data.greetingMessage;
                        updateGreetingUI();
                    }
                    if (data.botAvatar) {
                        const avatarContainer = shadow.getElementById('bot-avatar-container');
                        if (avatarContainer) {
                            avatarContainer.innerHTML = `
                                <img src="${data.botAvatar}" style="width:100%;height:100%;object-fit:cover;" alt="Avatar" onerror="this.style.display='none'; document.getElementById('bot-avatar-fallback').style.display='flex';" />
                                <span id="bot-avatar-fallback" style="display:none;width:18px;height:18px;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></span>
                                <div style="position:absolute;bottom:0;right:0;width:8px;height:8px;border-radius:50%;background:#10b981;border:1.5px solid var(--incode-primary-color);"></div>
                            `;
                        }
                    }

                    // Render practice locations drawer if exists
                    const isMed = isMedical(data.practiceType, data.botName);
                    if (data.practiceLocations && Array.isArray(data.practiceLocations) && data.practiceLocations.length > 0) {
                        state.practiceLocations = data.practiceLocations;
                        const toggleBtn = shadow.getElementById('toggle-locations-btn');
                        if (toggleBtn) {
                            toggleBtn.style.display = 'block';
                            toggleBtn.title = isMed ? "Jadwal & Lokasi Praktik" : "Lokasi & Cabang Bisnis";
                        }
                        
                        const drawerTitle = shadow.getElementById('locations-drawer-title');
                        if (drawerTitle) {
                            drawerTitle.innerHTML = `<i data-lucide="map-pin" style="width:16px;height:16px;color:var(--incode-primary-color);"></i> ${isMed ? "Lokasi & Jadwal Praktik" : "Lokasi & Cabang Bisnis"}`;
                        }
                        
                        // Render locations drawer content
                        const listContainer = shadow.getElementById('locations-list-container');
                             listContainer.innerHTML = data.practiceLocations.map(loc => {
                                 const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.hospital_name + ' ' + loc.address)}`;
                                 const phoneHtml = loc.phone ? `<p style="font-size:12px;color:#4b5563;margin:0;display:flex;align-items:center;gap:4px;">📞 Telp: <a href="tel:${loc.phone.replace(/[^0-9+]/g, '')}" style="color:var(--incode-primary-color);font-weight:600;text-decoration:none;">${loc.phone}</a></p>` : '';
                                 return `
                                     <div class="location-card">
                                         <h5 class="location-title">${loc.hospital_name}</h5>
                                         <p class="location-address">${loc.address}</p>
                                         <p class="location-hours">🕒 ${isMed ? "Jadwal Praktik" : "Jam Operasional"}: ${loc.hours}</p>
                                         ${phoneHtml}
                                         <a href="${mapLink}" target="_blank" class="location-map-btn">Petunjuk Arah 🗺️</a>
                                     </div>
                                 `;
                             }).join('');
                             if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: {} });
                    }

                    if (data.defaultPills && Array.isArray(data.defaultPills) && data.defaultPills.length > 0) {
                        defaultPills = data.defaultPills;
                        renderQuickPills();
                    } else {
                        defaultPills = isMed 
                            ? ["🏥 Lokasi & Jadwal Praktik", "📅 Cara Buat Janji Temu", "🩺 Layanan Spesialisasi", "📞 Kontak Darurat"]
                            : ["📍 Alamat & Lokasi", "💼 Jenis Layanan & Jasa", "ℹ️ Tentang Kami", "📞 Hubungi Kami"];
                        renderQuickPills();
                    }
                }
            } catch (e) {
                console.error('Chat Widget: Failed to load tenant configuration', e);
            }
        }
        loadDynamicConfig();

        // 5. Logic & Component Triggers
        const trigger = shadow.getElementById('widget-trigger');
        const windowEl = shadow.getElementById('chat-window');
        const input = shadow.getElementById('chat-input');
        const messagesContainer = shadow.getElementById('chat-messages');
        const leadForm = shadow.getElementById('lead-form');
        const startChatBtn = shadow.getElementById('start-chat-btn');
        
        const toggleLocationsBtn = shadow.getElementById('toggle-locations-btn');
        const locationsDrawer = shadow.getElementById('locations-drawer');
        const closeLocationsDrawer = shadow.getElementById('close-locations-drawer');

        // Apply personalized greeting initially
        updateGreetingUI();
        renderQuickPills();

        // Location Drawer trigger handlers
        if (toggleLocationsBtn && locationsDrawer) {
            toggleLocationsBtn.onclick = () => {
                locationsDrawer.classList.toggle('open');
                if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: {} });
            };
        }
        if (closeLocationsDrawer && locationsDrawer) {
            closeLocationsDrawer.onclick = () => {
                locationsDrawer.classList.remove('open');
            };
        }

        const extendSessionBtn = shadow.getElementById('extend-session-btn');
        if (extendSessionBtn) {
            extendSessionBtn.onclick = () => {
                console.log('Chat Widget: User requested extending active session.');
                resetIdleTimer();
            };
        }

        // Live validation for lead capture form
        const leadNameInput = shadow.getElementById('lead-name');
        const leadEmailInput = shadow.getElementById('lead-email');
        const gdprConsentInput = shadow.getElementById('gdpr-lead-consent');

        function validateLeadInputs() {
            const name = leadNameInput.value.trim();
            const email = leadEmailInput.value.trim();
            const consented = gdprConsentInput ? gdprConsentInput.checked : false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailValid = emailRegex.test(email);

            if (isEmailValid) {
                leadEmailInput.classList.add('valid');
                leadEmailInput.classList.remove('invalid');
            } else {
                leadEmailInput.classList.remove('valid');
                if (email.length > 0) leadEmailInput.classList.add('invalid');
                else leadEmailInput.classList.remove('invalid');
            }

            if (name.length >= 2) {
                leadNameInput.classList.add('valid');
            } else {
                leadNameInput.classList.remove('valid');
            }

            if (name.length >= 2 && isEmailValid && consented) {
                startChatBtn.removeAttribute('disabled');
                startChatBtn.style.opacity = '1';
                startChatBtn.style.cursor = 'pointer';
                startChatBtn.style.boxShadow = '0 4px 14px color-mix(in srgb, var(--incode-primary-color) 35%, transparent)';
            } else {
                startChatBtn.setAttribute('disabled', 'true');
                startChatBtn.style.opacity = '0.6';
                startChatBtn.style.cursor = 'not-allowed';
                startChatBtn.style.boxShadow = 'none';
            }
        }

        leadNameInput.oninput = validateLeadInputs;
        leadEmailInput.oninput = validateLeadInputs;
        if (gdprConsentInput) gdprConsentInput.onchange = validateLeadInputs;

        // Clear Conversation (Wipe history and session)
        const clearChatBtn = shadow.getElementById('clear-chat-btn');
        clearChatBtn.onclick = () => {
            if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat percakapan dan mulai dari awal?")) {
                console.log("Chat Widget: Wiping session and restarting lead registration.");
                
                // Clear state & storage
                state.leadInfo = null;
                localStorage.removeItem(`ai_chat_lead_${tenantId}`);
                sessionStorage.removeItem(`ai_chat_lead_${tenantId}`);
                
                // Create a new session
                state.sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
                sessionStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
                localStorage.setItem(`ai_chat_lat_${tenantId}`, Date.now().toString());
                
                if (locationsDrawer) locationsDrawer.classList.remove('open');
                document.body.style.overflow = '';

                // Reset UI messages
                messagesContainer.innerHTML = '<div class="message ai" id="initial-greeting">Halo! Ada yang bisa saya bantu?</div>';
                updateGreetingUI();
                
                // Reset inputs and validate
                leadNameInput.value = '';
                leadEmailInput.value = '';
                validateLeadInputs();
                
                // Render pills
                renderQuickPills();

                // Show leadForm with soft animation
                leadForm.style.display = 'flex';
                leadForm.style.opacity = '1';
                leadForm.style.transform = 'translateY(0)';
            }
        };

        // Scroll to Bottom float button logic
        const scrollDownBtn = shadow.getElementById('scroll-down-btn');
        const scrollDownBadge = shadow.getElementById('scroll-down-badge');
        let hasUnread = false;

        messagesContainer.onscroll = () => {
            const threshold = 80;
            const isScrolledUp = (messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight) > threshold;
            if (isScrolledUp) {
                scrollDownBtn.classList.add('visible');
            } else {
                scrollDownBtn.classList.remove('visible');
                hasUnread = false;
                scrollDownBadge.style.display = 'none';
            }
        };

        scrollDownBtn.onclick = () => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        function resetIdleTimer() {
            if (state.idleTimer) {
                clearTimeout(state.idleTimer);
                state.idleTimer = null;
            }
            if (state.warningTimer) {
                clearTimeout(state.warningTimer);
                state.warningTimer = null;
            }

            // Hide warning modal if active
            const warningEl = shadow.getElementById('session-warning');
            if (warningEl && warningEl.style.display === 'flex') {
                if (window.anime) {
                    window.anime({
                        targets: warningEl,
                        opacity: [1, 0],
                        scale: [1, 0.95],
                        duration: 250,
                        easing: 'easeInCubic',
                        complete: () => warningEl.style.display = 'none'
                    });
                } else {
                    warningEl.style.display = 'none';
                }
            }

            localStorage.setItem(`ai_chat_lat_${tenantId}`, Date.now().toString());
            
            // Calculate warning interval (2 minutes before timeout, or 75% of timeout if short)
            const warningMs = timeoutMs > 3 * 60 * 1000 ? timeoutMs - 2 * 60 * 1000 : timeoutMs * 0.75;

            // Start warning timer
            state.warningTimer = setTimeout(() => {
                const warningEl = shadow.getElementById('session-warning');
                if (warningEl && state.isOpen) {
                    if (window.lucide) {
                        window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: {} });
                    }
                    if (window.anime) {
                        warningEl.style.display = 'flex';
                        window.anime({
                            targets: warningEl,
                            opacity: [0, 1],
                            scale: [0.95, 1],
                            duration: 300,
                            easing: 'easeOutCubic'
                        });
                    } else {
                        warningEl.style.display = 'flex';
                        warningEl.style.opacity = '1';
                        warningEl.style.transform = 'scale(1)';
                    }
                }
            }, warningMs);

            // Start final timeout timer
            state.idleTimer = setTimeout(() => {
                console.log(`Chat Widget: Active idle timeout reached (${timeoutMinutes} minutes). Resetting session and wiping lead for privacy.`);
                
                // Clear state & storage
                state.leadInfo = null;
                localStorage.removeItem(`ai_chat_lead_${tenantId}`);
                sessionStorage.removeItem(`ai_chat_lead_${tenantId}`);
                
                // Create a new session
                state.sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
                sessionStorage.setItem(`ai_chat_sid_${tenantId}`, state.sessionId);
                localStorage.setItem(`ai_chat_lat_${tenantId}`, Date.now().toString());
                
                // Hide warning modal & drawer
                const warningEl = shadow.getElementById('session-warning');
                if (warningEl) warningEl.style.display = 'none';
                if (locationsDrawer) locationsDrawer.classList.remove('open');
                document.body.style.overflow = '';

                // Clear messages UI and reset to default initial greeting
                messagesContainer.innerHTML = '<div class="message ai" id="initial-greeting">Halo! Ada yang bisa saya bantu?</div>';
                updateGreetingUI();
                
                // Reset inputs & validation
                leadNameInput.value = '';
                leadEmailInput.value = '';
                validateLeadInputs();
                
                // Show lead form again
                if (window.anime) {
                    leadForm.style.display = 'flex';
                    window.anime({
                        targets: leadForm,
                        opacity: [0, 1],
                        translateY: [-20, 0],
                        duration: 400,
                        easing: 'easeOutCubic'
                    });
                } else {
                    leadForm.style.display = 'flex';
                    leadForm.style.opacity = '1';
                    leadForm.style.transform = 'translateY(0)';
                }
                
                state.idleTimer = null;
                if (state.warningTimer) {
                    clearTimeout(state.warningTimer);
                    state.warningTimer = null;
                }
            }, timeoutMs);
        }

        startChatBtn.onclick = () => {
            const name = leadNameInput.value.trim();
            const email = leadEmailInput.value.trim();
            
            if (name.length < 2 || !email.includes('@')) {
                return;
            }

            state.leadInfo = { name, email };
            localStorage.setItem(`ai_chat_lead_${tenantId}`, JSON.stringify(state.leadInfo));
            sessionStorage.setItem(`ai_chat_lead_${tenantId}`, JSON.stringify(state.leadInfo));
            
            // Force update greeting message dynamically with direct fallback
            const greetingEl = shadow.getElementById('initial-greeting');
            if (greetingEl) {
                const rawGreeting = state.greetingMessage || "Halo! Ada yang bisa saya bantu?";
                greetingEl.textContent = formatGreeting(rawGreeting, name);
            } else {
                updateGreetingUI();
            }

            // Show pills after login
            renderQuickPills();
            
            // Save lead immediately to DB in the background
            try {
                fetch(`${apiUrl}/api/public/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tenant_id: tenantId,
                        session_id: state.sessionId,
                        lead_name: name,
                        lead_email: email
                    })
                }).catch(err => console.error('Chat Widget: Failed to save lead immediately', err));
            } catch (e) {
                console.error('Chat Widget: Error calling save lead API', e);
            }
            
            if (window.anime) {
                window.anime({
                    targets: leadForm,
                    opacity: [1, 0],
                    translateY: [0, -20],
                    duration: 400,
                    easing: 'easeInCubic',
                    complete: () => leadForm.style.display = 'none'
                });
            } else {
                leadForm.style.display = 'none';
            }
        };

        function renderTurnstile() {
             const checkTurnstile = setInterval(() => {
                if (window.turnstile && turnstileSiteKey) {
                    clearInterval(checkTurnstile);
                    try {
                        const container = document.getElementById('ai-chat-turnstile-container');
                        if (!container) return;
                        
                        console.log('Chat Widget: Rendering Turnstile...');
                        const turnstileId = window.turnstile.render(container, {
                            sitekey: turnstileSiteKey,
                            callback: (token) => {
                                state.turnstileToken = token;
                                console.log('Chat Widget: Turnstile verified');
                            },
                            'error-callback': (err) => {
                                console.error('Chat Widget: Turnstile Error', err);
                            },
                            'expired-callback': () => {
                                state.turnstileToken = null;
                                window.turnstile.reset();
                            }
                        });
                        state.turnstileWidgetId = turnstileId;
                    } catch (e) {
                        console.error('Chat Widget: Turnstile Render Failed', e);
                    }
                }
            }, 500);
            
            // Timeout after 10s
            setTimeout(() => clearInterval(checkTurnstile), 10000);
        }

        renderTurnstile();

        trigger.onclick = () => {
            state.isOpen = !state.isOpen;
            container.setAttribute('data-open', state.isOpen ? 'true' : 'false');
            if (state.isOpen) {
                windowEl.classList.add('open');
                if (window.anime) window.anime({ targets: windowEl, opacity: [0, 1], translateY: [20, 0], duration: 400, easing: 'easeOutCubic' });
                else { windowEl.style.opacity = '1'; windowEl.style.transform = 'translateY(0)'; }
                
                // Prevent body scroll on mobile native full screen
                if (window.innerWidth <= 640) {
                    document.body.style.overflow = 'hidden';
                }
                
                resetIdleTimer();
                renderQuickPills();
            } else {
                windowEl.classList.remove('open');
                document.body.style.overflow = '';
                if (locationsDrawer) locationsDrawer.classList.remove('open');
                if (state.idleTimer) {
                    clearTimeout(state.idleTimer);
                    state.idleTimer = null;
                }
            }
        };

        shadow.getElementById('close-chat').onclick = trigger.onclick;

        async function sendMessage(overrideText) {
            if (state.isResponding) return;
            const text = overrideText ? overrideText.trim() : input.value.trim();
            if (!text) return;
            if (!overrideText) input.value = '';
            
            function setResponding(responding) {
                state.isResponding = responding;
                const sendBtn = shadow.getElementById('send-btn');
                if (responding) {
                    input.disabled = true;
                    input.placeholder = 'Sedang mengetik...';
                    if (sendBtn) {
                        sendBtn.disabled = true;
                        sendBtn.style.opacity = '0.5';
                        sendBtn.style.cursor = 'not-allowed';
                    }
                } else {
                    input.disabled = false;
                    input.placeholder = 'Tulis pesan...';
                    if (sendBtn) {
                        sendBtn.disabled = false;
                        sendBtn.style.opacity = '1';
                        sendBtn.style.cursor = 'pointer';
                    }
                    setTimeout(() => input.focus(), 50);
                }
            }

            setResponding(true);
            resetIdleTimer();
            pillsContainer.style.display = 'none'; // Fade out quick pills if a user types or clicks
            
            const userDiv = document.createElement('div'); 
            userDiv.className = 'message user'; 
            userDiv.textContent = text;
            messagesContainer.appendChild(userDiv);
            
            const aiDiv = document.createElement('div'); 
            aiDiv.className = 'message ai'; 
            aiDiv.innerHTML = `
                <div class="incode-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            messagesContainer.appendChild(aiDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            console.log('Chat Widget: Sending message with token:', state.turnstileToken ? 'Present' : 'MISSING');
 
            // Auto-retry Turnstile if token is missing
            if (!state.turnstileToken && window.turnstile) {
                console.log('Chat Widget: Token missing, attempting emergency reset...');
                try {
                    window.turnstile.reset();
                } catch (e) {
                    renderTurnstile();
                }
                // Wait a bit for token
                await new Promise(r => setTimeout(r, 1000));
            }

            try {
                const res = await fetch(`${apiUrl}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: text, 
                        tenant_id: tenantId, 
                        session_id: state.sessionId, 
                        turnstile_token: state.turnstileToken, 
                        lead_name: state.leadInfo?.name,
                        lead_email: state.leadInfo?.email,
                        history: [] 
                    })
                });

                if (state.turnstileWidgetId && typeof turnstile !== 'undefined') { 
                    turnstile.reset(state.turnstileWidgetId); 
                    state.turnstileToken = null; 
                }

                if (!res.ok) {
                    const reason = res.headers.get('X-Debug-Reason') || 'Error';
                    aiDiv.textContent = 'Maaf, terjadi kesalahan: ' + reason;
                    setResponding(false);
                    return;
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                aiDiv.textContent = '';
                let accumulatedText = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    chunk.split('\n').forEach(line => {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.response) { 
                                    accumulatedText += data.response; 
                                    // Parse markdown-style links safely to anchor tags and format newlines
                                    const escaped = accumulatedText
                                        .replace(/&/g, '&amp;')
                                        .replace(/</g, '&lt;')
                                        .replace(/>/g, '&gt;');
                                    const formatted = escaped
                                        .replace(/\n/g, '<br />')
                                        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|#[^\s)]+)\)/g, (match, linkText, url) => {
                                            return `<a href="${url}" style="display:inline-block;margin-top:10px;padding:12px 20px;background:var(--incode-primary-color);color:white;text-decoration:none;border-radius:14px;font-weight:600;text-align:center;box-shadow:0 4px 14px color-mix(in srgb, var(--incode-primary-color) 30%, transparent);transition:all 0.2s ease-in-out;width:calc(100% - 40px);box-sizing:border-box;border:none;font-size:13px;letter-spacing:0.3px;">${linkText}</a>`;
                                        });
                                    aiDiv.innerHTML = formatted;
                                    
                                    // Intercept click on any link inside this aiDiv that starts with '#' or contains 'janji' / 'praktek' / 'temu'
                                    aiDiv.querySelectorAll('a').forEach(a => {
                                        const href = a.getAttribute('href') || '';
                                        const text = a.textContent || '';
                                        if (href.startsWith('#') || text.includes('Janji') || text.includes('Praktek') || text.includes('Temu')) {
                                            a.onclick = (e) => {
                                                e.preventDefault();
                                                const drawer = shadow.getElementById('locations-drawer');
                                                if (drawer) {
                                                    drawer.classList.add('open');
                                                    if (window.lucide) window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: {} });
                                                }
                                            };
                                        } else {
                                            a.setAttribute('target', '_blank');
                                        }
                                    });
                                    
                                    // Monitor scroll badge trigger
                                    const isScrolledUp = (messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight) > 80;
                                    if (isScrolledUp) {
                                        hasUnread = true;
                                        scrollDownBadge.style.display = 'block';
                                    } else {
                                        messagesContainer.scrollTop = messagesContainer.scrollHeight; 
                                    }
                                }
                            } catch (e) {}
                        }
                    });
                }
                
                // Play harmonious notification chime
                playNotificationSound();
                resetIdleTimer();
                setResponding(false);
            } catch (e) { 
                aiDiv.textContent = 'Gagal koneksi.'; 
                resetIdleTimer();
                setResponding(false);
            }
        }

        shadow.getElementById('send-btn').onclick = () => sendMessage();
        input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
        
        // Polling loop for rendering Lucide icons asynchronously (scoped to widget)
        function renderWidgetIcons() {
            if (window.lucide) {
                window.lucide.createIcons({ nameAttr: 'data-lucide', attrs: {} });
            }
        }
        if (window.lucide) {
            renderWidgetIcons();
        } else {
            const checkLucide = setInterval(() => {
                if (window.lucide) {
                    clearInterval(checkLucide);
                    renderWidgetIcons();
                }
            }, 100);
            setTimeout(() => clearInterval(checkLucide), 10000);
        }
    }

    function init() {
        console.log('Chat Widget: Starting Global Init...');
        // Ensure Turnstile container exists in body (outside Shadow DOM)
        if (!document.getElementById('ai-chat-turnstile-container')) {
            const tsContainer = document.createElement('div');
            tsContainer.id = 'ai-chat-turnstile-container';
            tsContainer.style.position = 'fixed';
            tsContainer.style.bottom = '-500px';
            document.body.appendChild(tsContainer);
            console.log('Chat Widget: Turnstile container created');
        }

        if (window.__INCODE_CHAT_INITIALIZED && document.getElementById('ai-chat-widget-container')) {
            console.log('Chat Widget: Already initialized and container exists, skipping...');
            return;
        }
        window.__INCODE_CHAT_INITIALIZED = true;
        initChatWidget();
    }

    // Run on load and on Astro navigation
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
    document.addEventListener('astro:after-swap', init);
    document.addEventListener('astro:page-load', init);
})();
