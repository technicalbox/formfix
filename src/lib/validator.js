/**
 * FormFix Requirement Validator
 *
 * Validates a processed file against a preset's requirements.
 * Returns structured pass/fail results per criterion.
 *
 * @module validator
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} pass - Whether this criterion passes
 * @property {string} label - Human-readable criterion name
 * @property {string} expected - What was expected
 * @property {string} actual - What was found
 */

/**
 * @typedef {Object} FullValidation
 * @property {boolean} allPass - Whether all criteria pass
 * @property {ValidationResult[]} results - Individual criterion results
 * @property {string} summary - "Ready to upload" or "X issue(s) found"
 */

/**
 * Validate a file against a preset's requirements.
 *
 * @param {object} fileInfo - File metadata
 * @param {number} fileInfo.width - Image width in pixels
 * @param {number} fileInfo.height - Image height in pixels
 * @param {number} fileInfo.sizeKB - File size in KB
 * @param {string} fileInfo.format - MIME type (e.g., 'image/jpeg')
 * @param {object} requirements - Preset requirements
 * @param {string[]} [requirements.format] - Allowed formats
 * @param {object} [requirements.dimensions]
 * @param {object} [requirements.fileSize]
 * @returns {FullValidation}
 */
export function validateAgainstPreset(fileInfo, requirements) {
  /** @type {ValidationResult[]} */
  const results = [];

  // Format check
  if (requirements.format && requirements.format.length > 0) {
    const fileExt = mimeToExtension(fileInfo.format);
    const formatPass = requirements.format.some(
      (f) => f.toLowerCase() === fileExt.toLowerCase()
    );
    results.push({
      pass: formatPass,
      label: 'Format',
      expected: requirements.format.map((f) => f.toUpperCase()).join(' / '),
      actual: fileExt.toUpperCase(),
    });
  }

  // Dimension checks
  if (requirements.dimensions) {
    const dim = requirements.dimensions;

    // Exact dimensions
    if (dim.width !== null && dim.width !== undefined) {
      results.push({
        pass: fileInfo.width === dim.width,
        label: 'Width',
        expected: `${dim.width} px`,
        actual: `${fileInfo.width} px`,
      });
    }

    if (dim.height !== null && dim.height !== undefined) {
      results.push({
        pass: fileInfo.height === dim.height,
        label: 'Height',
        expected: `${dim.height} px`,
        actual: `${fileInfo.height} px`,
      });
    }

    // Min/max dimensions
    if (dim.minWidth !== null && dim.minWidth !== undefined) {
      results.push({
        pass: fileInfo.width >= dim.minWidth,
        label: 'Min Width',
        expected: `≥ ${dim.minWidth} px`,
        actual: `${fileInfo.width} px`,
      });
    }

    if (dim.minHeight !== null && dim.minHeight !== undefined) {
      results.push({
        pass: fileInfo.height >= dim.minHeight,
        label: 'Min Height',
        expected: `≥ ${dim.minHeight} px`,
        actual: `${fileInfo.height} px`,
      });
    }

    if (dim.maxWidth !== null && dim.maxWidth !== undefined) {
      results.push({
        pass: fileInfo.width <= dim.maxWidth,
        label: 'Max Width',
        expected: `≤ ${dim.maxWidth} px`,
        actual: `${fileInfo.width} px`,
      });
    }

    if (dim.maxHeight !== null && dim.maxHeight !== undefined) {
      results.push({
        pass: fileInfo.height <= dim.maxHeight,
        label: 'Max Height',
        expected: `≤ ${dim.maxHeight} px`,
        actual: `${fileInfo.height} px`,
      });
    }
  }

  // File size checks
  if (requirements.fileSize) {
    const fs = requirements.fileSize;
    const multiplier = fs.unit === 'MB' ? 1024 : 1;

    if (fs.max !== null && fs.max !== undefined) {
      const maxKB = fs.max * multiplier;
      results.push({
        pass: fileInfo.sizeKB <= maxKB,
        label: 'Max Size',
        expected: `≤ ${fs.max} ${fs.unit}`,
        actual: `${fileInfo.sizeKB} KB`,
      });
    }

    if (fs.min !== null && fs.min !== undefined) {
      const minKB = fs.min * multiplier;
      results.push({
        pass: fileInfo.sizeKB >= minKB,
        label: 'Min Size',
        expected: `≥ ${fs.min} ${fs.unit}`,
        actual: `${fileInfo.sizeKB} KB`,
      });
    }
  }

  const failCount = results.filter((r) => !r.pass).length;
  const allPass = failCount === 0;

  return {
    allPass,
    results,
    summary: allPass
      ? 'Ready to upload'
      : `${failCount} issue${failCount > 1 ? 's' : ''} found`,
  };
}

/**
 * Convert MIME type to common extension.
 * @param {string} mime
 * @returns {string}
 */
function mimeToExtension(mime) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mime] || 'unknown';
}
