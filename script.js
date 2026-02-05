const form = document.getElementById("target-form");
const resultCard = document.getElementById("result-card");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DEFAULT_BASELINE = 20000;
const IDEAL_GROWTH_RATE = 0.15;
const ACCEPTABLE_VARIANCE = 0.05;

function getBaselineSales(value) {
  const numeric = Number.parseFloat(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : DEFAULT_BASELINE;
}

function evaluateTarget(target, baseline) {
  const idealTarget = baseline * (1 + IDEAL_GROWTH_RATE);
  const variance = Math.abs(target - idealTarget) / idealTarget;

  if (variance <= ACCEPTABLE_VARIANCE) {
    return {
      status: "good",
      message: "Aligned with healthy growth expectations.",
      detail: "Your target is within 5% of the ideal recommendation.",
      idealTarget,
    };
  }

  if (target < idealTarget) {
    return {
      status: "warn",
      message: "Target is conservative.",
      detail: "Consider pushing slightly higher to meet growth goals.",
      idealTarget,
    };
  }

  return {
    status: "bad",
    message: "Target is aggressive.",
    detail: "It may be difficult to reach without extra investment.",
    idealTarget,
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const productName = document.getElementById("product-name").value.trim();
  const baselineSales = getBaselineSales(
    document.getElementById("current-sales").value
  );
  const targetSalesValue = Number.parseFloat(
    document.getElementById("target-sales").value
  );

  if (!Number.isFinite(targetSalesValue) || targetSalesValue <= 0) {
    resultCard.innerHTML = `<p class="muted">Please enter a valid target sales value.</p>`;
    return;
  }

  const evaluation = evaluateTarget(targetSalesValue, baselineSales);
  const productLabel = productName ? `for ${productName}` : "";

  resultCard.innerHTML = `
    <span class="badge ${evaluation.status}">${evaluation.message}</span>
    <p>${evaluation.detail}</p>
    <div class="metrics">
      <div><strong>Current baseline:</strong> ${currencyFormatter.format(baselineSales)}</div>
      <div><strong>Proposed target:</strong> ${currencyFormatter.format(targetSalesValue)} ${productLabel}</div>
      <div><strong>Ideal target:</strong> ${currencyFormatter.format(evaluation.idealTarget)}</div>
      <div class="muted">Model assumes a 15% growth objective.</div>
    </div>
  `;
});
