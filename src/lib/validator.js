/**
 * FormFix Requirement & Diagnostic Validator Engine (V2)
 *
 * Provides diagnostic validation of image files against exam presets
 * or custom user constraints. Calculates PASS / FAIL / WARNING states
 * and generates automated fix action plans.
 *
 * @module validator
 */

/**
 * @typedef {'PASS' | 'FAIL' | 'WARNING'} CheckStatus
 */

/**
 * @typedef {Object} DiagnosticCheck
 * @property {string} id - Unique check identifier (e.g., 'file-size', 'format')
 * @property {CheckStatus} status - PASS, FAIL, or WARNING
 * @property {boolean} pass - Backward compatible boolean
 * @property {string} label - Human-readable check title
 * @property {string} expected - Expected requirement string
 * @property {string} actual - Actual file property string
 * @property {string} [explanation] - Short contextual explanation
 * @property {string|null} [fixAction] - Action name: 'compress' | 'resize' | 'convert' | 'crop' | null
 * @property {object|null} [fixParams] - Parameters needed for automated fix execution
 */

/**
 * @typedef {Object} DetailedValidation
 * @property {boolean} allPass - True if zero FAIL checks exist
 * @property {number} failCount - Total failed checks
 * @property {number} warningCount - Total warning checks
 * @property {DiagnosticCheck[]} checks - List of diagnostic checks
 * @property {string} summary - Human-readable status summary
 * @property {boolean} canAutoFix - True if at least one failure can be fixed automatically
 */

/**
 * Perform detailed diagnostic validation against preset or custom requirements.
 *
 * @param {object} fileInfo - Image metadata
 * @param {number} fileInfo.width - Width in pixels
 * @param {number} fileInfo.height - Height in pixels
 * @param {number} fileInfo.sizeKB - Size in KB
 * @param {string} fileInfo.format - MIME type (e.g. 'image/jpeg')
 * @param {string} [fileInfo.name] - Original filename
 * @param {object} requirements - Preset or custom requirements object
 * @returns {DetailedValidation}
 */
export function validateImageDetailed(fileInfo, requirements = {}) {
  /** @type {DiagnosticCheck[]} */
  const checks = [];

  const reqFormat = requirements.format;
  const reqDim = requirements.dimensions || {};
  const reqFS = requirements.fileSize || {};

  // 1. Readability & Basic File Integrity
  if (fileInfo.width > 0 && fileInfo.height > 0) {
    checks.push({
      id: 'file-integrity',
      status: 'PASS',
      pass: true,
      label: 'File Readability',
      expected: 'Valid image file',
      actual: `${fileInfo.width}×${fileInfo.height} px`,
      explanation: 'File loaded and decoded successfully in browser.',
      fixAction: null,
      fixParams: null,
    });
  } else {
    checks.push({
      id: 'file-integrity',
      status: 'FAIL',
      pass: false,
      label: 'File Readability',
      expected: 'Valid image file',
      actual: 'Unreadable / Corrupt',
      explanation: 'Browser could not decode image dimensions.',
      fixAction: null,
      fixParams: null,
    });
  }

  // 2. Format / MIME Type Check
  if (reqFormat && reqFormat.length > 0) {
    const fileExt = mimeToExtension(fileInfo.format);
    const formatPass = reqFormat.some(
      (f) => f.toLowerCase() === fileExt.toLowerCase()
    );
    const targetMime = extensionToMime(reqFormat[0]);

    checks.push({
      id: 'format',
      status: formatPass ? 'PASS' : 'FAIL',
      pass: formatPass,
      label: 'File Format',
      expected: reqFormat.map((f) => f.toUpperCase()).join(' / '),
      actual: fileExt.toUpperCase(),
      explanation: formatPass
        ? 'Format satisfies requirement.'
        : `File is ${fileExt.toUpperCase()}. Application requires ${reqFormat.map((f) => f.toUpperCase()).join('/')}.`,
      fixAction: formatPass ? null : 'convert',
      fixParams: formatPass ? null : { targetFormat: targetMime },
    });
  }

  // 3. Exact Dimensions Check
  const hasExactWidth = reqDim.width !== null && reqDim.width !== undefined && reqDim.width > 0;
  const hasExactHeight = reqDim.height !== null && reqDim.height !== undefined && reqDim.height > 0;

  if (hasExactWidth && hasExactHeight) {
    const dimPass = fileInfo.width === reqDim.width && fileInfo.height === reqDim.height;
    checks.push({
      id: 'dimensions-exact',
      status: dimPass ? 'PASS' : 'FAIL',
      pass: dimPass,
      label: 'Exact Dimensions',
      expected: `${reqDim.width} × ${reqDim.height} px`,
      actual: `${fileInfo.width} × ${fileInfo.height} px`,
      explanation: dimPass
        ? 'Dimensions match portal requirements exactly.'
        : `Image is ${fileInfo.width}×${fileInfo.height} px, expected ${reqDim.width}×${reqDim.height} px.`,
      fixAction: dimPass ? null : 'resize',
      fixParams: dimPass ? null : { width: reqDim.width, height: reqDim.height },
    });
  } else {
    if (hasExactWidth) {
      const wPass = fileInfo.width === reqDim.width;
      checks.push({
        id: 'width-exact',
        status: wPass ? 'PASS' : 'FAIL',
        pass: wPass,
        label: 'Width',
        expected: `${reqDim.width} px`,
        actual: `${fileInfo.width} px`,
        explanation: wPass ? 'Width satisfies requirement.' : `Expected width of ${reqDim.width} px.`,
        fixAction: wPass ? null : 'resize',
        fixParams: wPass ? null : { width: reqDim.width, height: fileInfo.height },
      });
    }

    if (hasExactHeight) {
      const hPass = fileInfo.height === reqDim.height;
      checks.push({
        id: 'height-exact',
        status: hPass ? 'PASS' : 'FAIL',
        pass: hPass,
        label: 'Height',
        expected: `${reqDim.height} px`,
        actual: `${fileInfo.height} px`,
        explanation: hPass ? 'Height satisfies requirement.' : `Expected height of ${reqDim.height} px.`,
        fixAction: hPass ? null : 'resize',
        fixParams: hPass ? null : { width: fileInfo.width, height: reqDim.height },
      });
    }
  }

  // 4. Min / Max Bounding Dimensions
  if (reqDim.minWidth !== null && reqDim.minWidth !== undefined && reqDim.minWidth > 0) {
    const minWPass = fileInfo.width >= reqDim.minWidth;
    checks.push({
      id: 'min-width',
      status: minWPass ? 'PASS' : 'FAIL',
      pass: minWPass,
      label: 'Minimum Width',
      expected: `≥ ${reqDim.minWidth} px`,
      actual: `${fileInfo.width} px`,
      explanation: minWPass ? 'Width meets minimum requirement.' : `Width is below ${reqDim.minWidth} px threshold.`,
      fixAction: minWPass ? null : 'resize',
      fixParams: minWPass ? null : { width: reqDim.minWidth, height: Math.round(fileInfo.height * (reqDim.minWidth / fileInfo.width)) },
    });
  }

  if (reqDim.maxWidth !== null && reqDim.maxWidth !== undefined && reqDim.maxWidth > 0) {
    const maxWPass = fileInfo.width <= reqDim.maxWidth;
    checks.push({
      id: 'max-width',
      status: maxWPass ? 'PASS' : 'FAIL',
      pass: maxWPass,
      label: 'Maximum Width',
      expected: `≤ ${reqDim.maxWidth} px`,
      actual: `${fileInfo.width} px`,
      explanation: maxWPass ? 'Width meets maximum limit.' : `Width exceeds ${reqDim.maxWidth} px limit.`,
      fixAction: maxWPass ? null : 'resize',
      fixParams: maxWPass ? null : { width: reqDim.maxWidth, height: Math.round(fileInfo.height * (reqDim.maxWidth / fileInfo.width)) },
    });
  }

  if (reqDim.minHeight !== null && reqDim.minHeight !== undefined && reqDim.minHeight > 0) {
    const minHPass = fileInfo.height >= reqDim.minHeight;
    checks.push({
      id: 'min-height',
      status: minHPass ? 'PASS' : 'FAIL',
      pass: minHPass,
      label: 'Minimum Height',
      expected: `≥ ${reqDim.minHeight} px`,
      actual: `${fileInfo.height} px`,
      explanation: minHPass ? 'Height meets minimum requirement.' : `Height is below ${reqDim.minHeight} px threshold.`,
      fixAction: minHPass ? null : 'resize',
      fixParams: minHPass ? null : { height: reqDim.minHeight, width: Math.round(fileInfo.width * (reqDim.minHeight / fileInfo.height)) },
    });
  }

  if (reqDim.maxHeight !== null && reqDim.maxHeight !== undefined && reqDim.maxHeight > 0) {
    const maxHPass = fileInfo.height <= reqDim.maxHeight;
    checks.push({
      id: 'max-height',
      status: maxHPass ? 'PASS' : 'FAIL',
      pass: maxHPass,
      label: 'Maximum Height',
      expected: `≤ ${reqDim.maxHeight} px`,
      actual: `${fileInfo.height} px`,
      explanation: maxHPass ? 'Height meets maximum limit.' : `Height exceeds ${reqDim.maxHeight} px limit.`,
      fixAction: maxHPass ? null : 'resize',
      fixParams: maxHPass ? null : { height: reqDim.maxHeight, width: Math.round(fileInfo.width * (reqDim.maxHeight / fileInfo.height)) },
    });
  }

  // 5. Aspect Ratio Check
  if (hasExactWidth && hasExactHeight) {
    const targetRatio = reqDim.width / reqDim.height;
    const actualRatio = fileInfo.width / fileInfo.height;
    const ratioDiff = Math.abs(targetRatio - actualRatio);
    const aspectPass = ratioDiff <= 0.03; // 3% tolerance

    checks.push({
      id: 'aspect-ratio',
      status: aspectPass ? 'PASS' : 'FAIL',
      pass: aspectPass,
      label: 'Aspect Ratio',
      expected: `${reqDim.width}:${reqDim.height} (${targetRatio.toFixed(2)})`,
      actual: `${actualRatio.toFixed(2)}`,
      explanation: aspectPass
        ? 'Aspect ratio matches requirement.'
        : `Image aspect ratio (${actualRatio.toFixed(2)}) differs from required ratio (${targetRatio.toFixed(2)}).`,
      fixAction: aspectPass ? null : 'crop',
      fixParams: aspectPass ? null : { targetRatio, width: reqDim.width, height: reqDim.height },
    });
  }

  // 6. File Size Checks
  if (reqFS.max !== null && reqFS.max !== undefined && reqFS.max > 0) {
    const multiplier = reqFS.unit === 'MB' ? 1024 : 1;
    const maxKB = reqFS.max * multiplier;
    const sizePass = fileInfo.sizeKB <= maxKB;

    checks.push({
      id: 'file-size-max',
      status: sizePass ? 'PASS' : 'FAIL',
      pass: sizePass,
      label: 'Maximum File Size',
      expected: `≤ ${reqFS.max} ${reqFS.unit || 'KB'}`,
      actual: `${fileInfo.sizeKB} KB`,
      explanation: sizePass
        ? 'File size is within target limit.'
        : `File size (${fileInfo.sizeKB} KB) exceeds maximum limit of ${reqFS.max} ${reqFS.unit || 'KB'}.`,
      fixAction: sizePass ? null : 'compress',
      fixParams: sizePass ? null : { targetKB: maxKB },
    });
  }

  if (reqFS.min !== null && reqFS.min !== undefined && reqFS.min > 0) {
    const multiplier = reqFS.unit === 'MB' ? 1024 : 1;
    const minKB = reqFS.min * multiplier;
    const minSizePass = fileInfo.sizeKB >= minKB;

    checks.push({
      id: 'file-size-min',
      status: minSizePass ? 'PASS' : 'WARNING',
      pass: minSizePass,
      label: 'Minimum File Size',
      expected: `≥ ${reqFS.min} ${reqFS.unit || 'KB'}`,
      actual: `${fileInfo.sizeKB} KB`,
      explanation: minSizePass
        ? 'File size meets minimum requirement.'
        : `File size is below ${reqFS.min} ${reqFS.unit || 'KB'}. Uploading a very small file may lead to rejection for low quality.`,
      fixAction: null,
      fixParams: null,
    });
  }

  // Calculate totals
  const failCount = checks.filter((c) => c.status === 'FAIL').length;
  const warningCount = checks.filter((c) => c.status === 'WARNING').length;
  const allPass = failCount === 0;
  const canAutoFix = checks.some((c) => c.status === 'FAIL' && c.fixAction !== null);

  let summary;
  if (allPass && warningCount === 0) {
    summary = 'Your image meets all selected technical requirements.';
  } else if (allPass && warningCount > 0) {
    summary = `Passes all mandatory requirements with ${warningCount} warning${warningCount > 1 ? 's' : ''}.`;
  } else {
    summary = `${failCount} requirement${failCount > 1 ? 's' : ''} failed and need attention.`;
  }

  return {
    allPass,
    failCount,
    warningCount,
    checks,
    summary,
    canAutoFix,
  };
}

/**
 * Legacy wrapper for backward compatibility.
 * @param {object} fileInfo
 * @param {object} requirements
 * @returns {object}
 */
export function validateAgainstPreset(fileInfo, requirements) {
  const detailed = validateImageDetailed(fileInfo, requirements);
  return {
    allPass: detailed.allPass,
    results: detailed.checks.map((c) => ({
      pass: c.pass,
      label: c.label,
      expected: c.expected,
      actual: c.actual,
    })),
    summary: detailed.summary,
  };
}

/**
 * Plan an automated sequence of fix actions to resolve all failed constraints.
 * Order: Crop -> Resize -> Convert Format -> Compress.
 *
 * @param {DetailedValidation} validation
 * @param {object} requirements
 * @returns {Array<{type: 'crop'|'resize'|'convert'|'compress', params: object}>}
 */
export function planFixSequence(validation, requirements) {
  const actions = [];
  const checks = validation.checks.filter((c) => c.status === 'FAIL');

  const reqDim = requirements.dimensions || {};
  const reqFormat = requirements.format;
  const reqFS = requirements.fileSize || {};

  // Check if exact dimensions are specified
  const hasExactDim = reqDim.width && reqDim.height;
  const targetFormat = reqFormat && reqFormat.length > 0 ? extensionToMime(reqFormat[0]) : 'image/jpeg';
  const targetKB = reqFS.max ? (reqFS.unit === 'MB' ? reqFS.max * 1024 : reqFS.max) : null;

  // Step 1: Resize if width/height fail or if exact dimensions required
  const dimFailed = checks.some((c) => ['dimensions-exact', 'width-exact', 'height-exact', 'max-width', 'max-height', 'min-width', 'min-height'].includes(c.id));
  if (dimFailed && hasExactDim) {
    actions.push({
      type: 'resize',
      label: `Resize to ${reqDim.width} × ${reqDim.height} px`,
      params: { width: reqDim.width, height: reqDim.height, format: targetFormat },
    });
  }

  // Step 2: Convert format if format check failed
  const formatFailed = checks.some((c) => c.id === 'format');
  if (formatFailed) {
    actions.push({
      type: 'convert',
      label: `Convert to ${reqFormat[0].toUpperCase()}`,
      params: { targetFormat },
    });
  }

  // Step 3: Compress file size if max size failed
  const sizeFailed = checks.some((c) => c.id === 'file-size-max');
  if (sizeFailed && targetKB) {
    actions.push({
      type: 'compress',
      label: `Compress to ≤ ${reqFS.max} ${reqFS.unit || 'KB'}`,
      params: { targetKB, format: targetFormat, maxWidth: reqDim.width || undefined, maxHeight: reqDim.height || undefined },
    });
  }

  return actions;
}

/**
 * MIME to extension helper.
 * @param {string} mime
 * @returns {string}
 */
function mimeToExtension(mime) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mime] || 'jpg';
}

/**
 * Extension to MIME helper.
 * @param {string} ext
 * @returns {string}
 */
function extensionToMime(ext) {
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };
  return map[ext.toLowerCase()] || 'image/jpeg';
}
