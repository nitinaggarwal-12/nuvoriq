#!/usr/bin/env node
/**
 * End-to-End Verification, Unique DOM ID Audit & iOS/Android Mobile Suite
 * Uses Google-Signed Chrome on Local Mac (/Applications/Google Chrome.app/Contents/MacOS/Google Chrome)
 * or Cloudtop Linux (/usr/bin/google-chrome-stable) via puppeteer-core with an isolated temp profile.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const targetUrl = process.argv[2] || 'http://localhost:3045';
const outputDir =
  process.argv[3] ||
  path.resolve(process.cwd(), 'scratch/verification_screenshots');

function resolveGoogleSignedChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/opt/google/chrome/google-chrome',
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Google-signed Chrome binary not found on Local Mac or Cloudtop');
}

async function auditDomUniqueIds(page, viewName) {
  return await page.evaluate((viewLabel) => {
    const selector =
      'header, aside, main, nav, footer, section, article, button, a, input, select, textarea, form, [role="tab"], [role="dialog"]';
    const elements = Array.from(document.querySelectorAll(selector));
    const missingIds = elements
      .filter((el) => !el.id || el.id.trim() === '')
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').trim().slice(0, 40),
      }));

    const allWithId = Array.from(document.querySelectorAll('[id]'));
    const idCounts = new Map();
    for (const el of allWithId) {
      idCounts.set(el.id, (idCounts.get(el.id) || 0) + 1);
    }
    const duplicateIds = Array.from(idCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([id, count]) => ({ id, count }));

    return {
      view: viewLabel,
      totalAuditedElements: elements.length,
      totalUniqueIdsInDom: allWithId.length,
      missingIdCount: missingIds.length,
      missingIdsSample: missingIds.slice(0, 5),
      duplicateIdCount: duplicateIds.length,
      duplicateIds,
      passed: missingIds.length === 0 && duplicateIds.length === 0,
    };
  }, viewName);
}

async function runVerification() {
  fs.mkdirSync(outputDir, { recursive: true });
  const executablePath = resolveGoogleSignedChromePath();
  const isolatedProfileDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'kinetiq_google_chrome_e2e_')
  );

  console.log(`🚀 Launching Google-Signed Chrome: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    userDataDir: isolatedProfileDir,
    defaultViewport: { width: 1600, height: 950, deviceScaleFactor: 2 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-sync',
      '--password-store=basic',
    ],
  });

  const results = {
    chromeBinary: executablePath,
    uniqueIdAudits: {},
    mobilePlatformAudits: {},
    steps: {},
  };

  try {
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Audit IDs on Child 1 (Leo) View
    results.uniqueIdAudits.child1_workspace = await auditDomUniqueIds(page, 'Child 1 (Leo) Workspace');

    // STEP 1: Child 1 (Leo - Grade 4, Co-Pilot) Initial View & Cognitive Load Clash
    const step1Shot = path.join(outputDir, '01_leo_copilot_dashboard.png');
    await page.screenshot({ path: step1Shot, fullPage: false });

    const clashVisible = await page.$('#section-cognitive-clash-alert-child-1');
    results.steps.step1_cognitive_load_balancer = {
      clashDetectedInitially: Boolean(clashVisible),
      screenshot: step1Shot,
    };

    const rebalanceBtn = await page.$('#btn-auto-balance-cognitive-child-1');
    if (rebalanceBtn) {
      await rebalanceBtn.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    // STEP 2: Test Time Estimation & Visual Countdown Calibration on AoPS Math
    const startAopsBtn = await page.$('#btn-start-task-task-leo-1');
    await startAopsBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    results.uniqueIdAudits.focus_modal_estimate = await auditDomUniqueIds(
      page,
      'Focus Modal (Stage 1 Estimate)'
    );

    const preset20 = await page.$('#btn-estimate-preset-20m');
    if (preset20) await preset20.click();

    const step2EstimateShot = path.join(outputDir, '02_time_blindness_estimation_modal.png');
    await page.screenshot({ path: step2EstimateShot, fullPage: false });

    const launchTimerBtn = await page.$('#btn-launch-focus-timer');
    await launchTimerBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    const sim27Btn = await page.$('#btn-sim-set-27m');
    await sim27Btn.click();
    await new Promise((r) => setTimeout(r, 250));

    const elapsedText = await page.$eval(
      '#text-active-elapsed-display',
      (el) => el.textContent.trim()
    );

    const step2TimerShot = path.join(outputDir, '03_visual_countdown_sprint_timer.png');
    await page.screenshot({ path: step2TimerShot, fullPage: false });

    const finishSprintBtn = await page.$('#btn-finish-sprint-audit');
    await finishSprintBtn.click();
    await new Promise((r) => setTimeout(r, 350));

    results.uniqueIdAudits.focus_modal_reflect = await auditDomUniqueIds(
      page,
      'Focus Modal (Stage 3 Delta & Reflection)'
    );

    const calibrationText = await page.$eval(
      '#card-time-calibration-comparison',
      (el) => el.textContent.trim()
    );

    const step2ReflectShot = path.join(outputDir, '04_time_delta_and_metacognitive_reflection.png');
    await page.screenshot({ path: step2ReflectShot, fullPage: false });

    const saveReflectionBtn = await page.$('#btn-save-calibration-reflection');
    await saveReflectionBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    results.steps.step2_time_estimation_calibration = {
      passed:
        elapsedText === '27:00' &&
        calibrationText.includes('Estimated 20 min vs. Actual 27 min'),
      elapsedText,
      calibrationSummary: calibrationText,
      screenshots: [step2EstimateShot, step2TimerShot, step2ReflectShot],
    };

    // STEP 3: Switch to Parent Command Center & Verify Sunday Family Summit Conversation Cards
    const parentSwitchBtn = await page.$('#tab-profile-switch-parent');
    await parentSwitchBtn.click();
    await new Promise((r) => setTimeout(r, 500));

    results.uniqueIdAudits.parent_command_center = await auditDomUniqueIds(
      page,
      'Parent Command Center'
    );

    const summitSectionText = await page.$eval(
      '#section-sunday-family-summit',
      (el) => el.textContent.trim()
    );
    const leoSummitCard = await page.$('#card-sunday-summit-child-1');
    const mayaSummitCard = await page.$('#card-sunday-summit-child-2');

    const step3ParentShot = path.join(outputDir, '05_parent_command_center_sunday_summit.png');
    await page.screenshot({ path: step3ParentShot, fullPage: false });

    results.steps.step3_sunday_summit_and_parent_coaching = {
      passed:
        Boolean(leoSummitCard) &&
        Boolean(mayaSummitCard) &&
        summitSectionText.includes('Sunday Conversation Card'),
      hasLeoConversationCard: Boolean(leoSummitCard),
      hasMayaConversationCard: Boolean(mayaSummitCard),
      screenshot: step3ParentShot,
    };

    // STEP 4: Switch to Child 2 (Maya - Grade 1, Guided)
    const mayaSwitchBtn = await page.$('#tab-profile-switch-child-2');
    await mayaSwitchBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    results.uniqueIdAudits.child2_workspace = await auditDomUniqueIds(
      page,
      'Child 2 (Maya) Workspace'
    );

    const step4MayaShot = path.join(outputDir, '06_maya_grade1_guided_workspace.png');
    await page.screenshot({ path: step4MayaShot, fullPage: false });

    // STEP 4B: Test Left Collapsible Sidebar & Multi-Theme Studio Switcher
    const leoSidebarBtn = await page.$('#btn-sidebar-profile-child-1');
    if (leoSidebarBtn) await leoSidebarBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    // Switch to Solar Daylight Theme
    const solarThemeBtn = await page.$('#btn-sidebar-theme-solar-daylight');
    await solarThemeBtn.click();
    await new Promise((r) => setTimeout(r, 350));

    const activeDataThemeSolar = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    const solarShot = path.join(outputDir, '07_solar_daylight_theme_with_sidebar.png');
    await page.screenshot({ path: solarShot, fullPage: false });

    // Switch to Cosmic Aurora Theme & Collapse Left Sidebar
    const auroraThemeBtn = await page.$('#btn-sidebar-theme-aurora-indigo');
    await auroraThemeBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    const collapseBtn = await page.$('#btn-sidebar-collapse-toggle');
    await collapseBtn.click();
    await new Promise((r) => setTimeout(r, 350));

    const sidebarCollapsedAttr = await page.$eval('#aside-collapsible-sidebar', (el) =>
      el.getAttribute('data-collapsed')
    );
    const activeDataThemeAurora = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    results.uniqueIdAudits.collapsed_sidebar_view = await auditDomUniqueIds(
      page,
      'Collapsed Left Sidebar + Aurora Indigo Theme'
    );

    const auroraCollapsedShot = path.join(
      outputDir,
      '08_aurora_indigo_collapsed_sidebar.png'
    );
    await page.screenshot({ path: auroraCollapsedShot, fullPage: false });

    // Expand Sidebar & test Oceanic Breeze on both Leo & Parent Command Center
    await collapseBtn.click();
    const oceanicBtn = await page.$('#btn-sidebar-theme-oceanic-breeze');
    if (oceanicBtn) await oceanicBtn.click();
    await new Promise((r) => setTimeout(r, 350));

    const oceanicLeoShot = path.join(outputDir, '09_oceanic_breeze_leo_fullpage.png');
    await page.screenshot({ path: oceanicLeoShot, fullPage: true });

    const parentSidebarBtn = await page.$('#btn-sidebar-profile-parent');
    if (parentSidebarBtn) await parentSidebarBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    const oceanicParentShot = path.join(outputDir, '10_oceanic_breeze_parent_fullpage.png');
    await page.screenshot({ path: oceanicParentShot, fullPage: true });

    // Restore Obsidian Teal default
    const obsidianBtn = await page.$('#btn-sidebar-theme-obsidian-teal');
    if (obsidianBtn) await obsidianBtn.click();
    if (leoSidebarBtn) await leoSidebarBtn.click();
    await new Promise((r) => setTimeout(r, 250));

    results.steps.step4b_collapsible_sidebar_and_themes = {
      passed:
        activeDataThemeSolar === 'SOLAR_DAYLIGHT' &&
        activeDataThemeAurora === 'AURORA_INDIGO' &&
        sidebarCollapsedAttr === 'true',
      activeDataThemeSolar,
      activeDataThemeAurora,
      sidebarCollapsedAttr,
      screenshots: [solarShot, auroraCollapsedShot, oceanicLeoShot, oceanicParentShot],
    };

    // STEP 4C: Test Add Kid + Tracker + Assignment Studio Modal & Google SSO Kid Privacy Isolation
    const addKidHeaderBtn = await page.$('#btn-header-add-kid');
    await addKidHeaderBtn.click();
    await new Promise((r) => setTimeout(r, 350));

    results.uniqueIdAudits.studio_modal_add_kid = await auditDomUniqueIds(
      page,
      'Studio Modal (Add Kid Tab)'
    );
    const addKidShot = path.join(outputDir, '11_add_kid_studio_modal.png');
    await page.screenshot({ path: addKidShot, fullPage: false });

    const tabCreateTracker = await page.$('#tab-studio-create-tracker');
    await tabCreateTracker.click();
    await new Promise((r) => setTimeout(r, 250));
    results.uniqueIdAudits.studio_modal_create_tracker = await auditDomUniqueIds(
      page,
      'Studio Modal (Create Tracker Tab)'
    );

    const tabCreateAssignment = await page.$('#tab-studio-create-assignment');
    await tabCreateAssignment.click();
    await new Promise((r) => setTimeout(r, 250));
    results.uniqueIdAudits.studio_modal_create_assignment = await auditDomUniqueIds(
      page,
      'Studio Modal (Create Assignment Tab)'
    );

    const closeStudioBtn = await page.$('#btn-close-kid-tracker-studio');
    await closeStudioBtn.click();
    await new Promise((r) => setTimeout(r, 250));

    // Open Google SSO Modal & Sign in as Kid (Leo) to verify Kid Privacy Isolation
    const ssoHeaderBtn = await page.$('#btn-header-google-sso');
    await ssoHeaderBtn.click();
    await new Promise((r) => setTimeout(r, 350));

    results.uniqueIdAudits.google_sso_modal = await auditDomUniqueIds(
      page,
      'Google SSO Account Switcher Modal'
    );
    const ssoModalShot = path.join(outputDir, '12_google_sso_modal.png');
    await page.screenshot({ path: ssoModalShot, fullPage: false });

    const leoSsoBtn = await page.$('#btn-google-sso-kid-child-1');
    await leoSsoBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    results.uniqueIdAudits.kid_isolated_sso_view = await auditDomUniqueIds(
      page,
      'Kid Isolated SSO Session (Leo Only)'
    );

    const privacyLockBadge = await page.$('#badge-kid-privacy-lock');
    const leoTabInIsolatedMode = await page.$('#tab-profile-switch-child-1');
    const mayaTabInIsolatedMode = await page.$('#tab-profile-switch-child-2');
    const parentTabInIsolatedMode = await page.$('#tab-profile-switch-parent');

    const kidIsolatedShot = path.join(outputDir, '13_kid_sso_isolated_workspace.png');
    await page.screenshot({ path: kidIsolatedShot, fullPage: false });

    // Log +1 progress on Leo's custom tracker (trk-leo-aops)
    const logTrackerBtn = await page.$('#btn-log-tracker-progress-trk-leo-aops');
    if (logTrackerBtn) {
      await logTrackerBtn.click();
      await new Promise((r) => setTimeout(r, 250));
    }

    // Switch back to Parent Admin via 1-tap toggle or SSO modal
    const exitIsolationBtn = await page.$('#btn-toggle-kid-sso-isolation-child-1');
    if (exitIsolationBtn) {
      await exitIsolationBtn.click();
      await new Promise((r) => setTimeout(r, 350));
    }

    results.steps.step4c_google_sso_and_kid_isolation = {
      passed:
        Boolean(privacyLockBadge) &&
        Boolean(leoTabInIsolatedMode) &&
        mayaTabInIsolatedMode === null &&
        parentTabInIsolatedMode === null,
      privacyLockBadgeVisible: Boolean(privacyLockBadge),
      leoTabVisible: Boolean(leoTabInIsolatedMode),
      siblingMayaTabHidden: mayaTabInIsolatedMode === null,
      parentHubTabHidden: parentTabInIsolatedMode === null,
      screenshots: [addKidShot, ssoModalShot, kidIsolatedShot],
    };

    // STEP 5: iOS (iPhone 15 Pro - 393x852) & Android (Pixel 8 Pro - 412x915) Emulation Audit
    const mobileDevices = [
      {
        platform: 'iOS_iPhone_15_Pro',
        width: 393,
        height: 852,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
      },
      {
        platform: 'Android_Pixel_8_Pro',
        width: 412,
        height: 915,
        userAgent:
          'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
      },
    ];

    for (const dev of mobileDevices) {
      const mPage = await browser.newPage();
      await mPage.setUserAgent(dev.userAgent);
      await mPage.setViewport({
        width: dev.width,
        height: dev.height,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      });
      await mPage.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      const mobileCheck = await mPage.evaluate(() => {
        const doc = document.documentElement;
        const horizontalOverflowPx = Math.max(0, doc.scrollWidth - doc.clientWidth);
        const dock = document.getElementById('nav-mobile-bottom-dock');
        const dockRect = dock ? dock.getBoundingClientRect() : null;
        const viewportMeta =
          document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
        const appleWebAppCapable =
          document
            .querySelector('meta[name="apple-mobile-web-app-capable"]')
            ?.getAttribute('content') || '';
        const manifestHref =
          document.querySelector('link[rel="manifest"]')?.getAttribute('href') || '';

        return {
          horizontalOverflowPx,
          bottomDockVisible: Boolean(dockRect && dockRect.height >= 44),
          viewportMeta,
          appleWebAppCapable,
          manifestHref,
        };
      });

      const mobileShot = path.join(
        outputDir,
        `mobile_${dev.platform}_${dev.width}x${dev.height}.png`
      );
      await mPage.screenshot({ path: mobileShot, fullPage: false });
      results.mobilePlatformAudits[dev.platform] = {
        ...mobileCheck,
        screenshot: mobileShot,
        passed:
          mobileCheck.horizontalOverflowPx === 0 &&
          mobileCheck.bottomDockVisible &&
          mobileCheck.viewportMeta.includes('viewport-fit=cover'),
      };
      await mPage.close();
    }
  } finally {
    await browser.close();
    try {
      fs.rmSync(isolatedProfileDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }

  const summaryPath = path.join(outputDir, 'e2e_verification_report.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

runVerification().catch((err) => {
  console.error('E2E Verification failed:', err);
  process.exit(1);
});
