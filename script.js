"use strict";
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  navigation.classList.toggle("is-open", open);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
document.querySelector("#year").textContent = new Date().getFullYear();
const form = document.querySelector("#contact-form");
const preview = document.querySelector("#message-preview");
const copyStatus = document.querySelector("#copy-status");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  preview.value = `Olá, Hexmídia!\nMeu nome é ${data.get("name").trim()}.\n${data.get("company").trim() ? `Empresa / instituição: ${data.get("company").trim()}\n` : ""}Interesse: ${data.get("interest")}.\n${data.get("message").trim()}`;
  document.querySelector("#contact-result").hidden = false;
  copyStatus.textContent = "";
  preview.focus();
});
document.querySelector("#copy-message").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preview.value);
    copyStatus.textContent = "Mensagem copiada!";
  } catch {
    preview.focus();
    preview.select();
    copyStatus.textContent =
      "Selecione e copie o texto acima com o comando de copiar do seu dispositivo.";
  }
});
if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-heading, .about-content, .service, .process-grid article, .essence-grid article",
    )
    .forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
}
