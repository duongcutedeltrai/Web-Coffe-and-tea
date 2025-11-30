document.addEventListener("DOMContentLoaded", () => {
  // Social share buttons
  const socialButtons = document.querySelectorAll(".social-btn")

  socialButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const ariaLabel = this.getAttribute("aria-label")
      const pageTitle = document.querySelector(".article-title").textContent
      const pageUrl = window.location.href

      let shareUrl = ""

      if (ariaLabel.includes("Facebook")) {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
      } else if (ariaLabel.includes("Instagram")) {
        alert("Vui lòng mở Instagram và chia sẻ liên kết này")
        return
      } else if (ariaLabel.includes("Twitter")) {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`
      } else if (ariaLabel.includes("WhatsApp")) {
        shareUrl = `https://wa.me/?text=${encodeURIComponent(pageTitle + " " + pageUrl)}`
      }

      if (shareUrl) {
        window.open(shareUrl, "share", "width=600,height=400")
      }
    })
  })

  // CTA button
  const ctaButton = document.querySelector(".cta-button")
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      alert("Cảm ơn bạn! Vui lòng kiểm tra email của bạn.")
    })
  }

  // Navigation buttons
  const navButtons = document.querySelectorAll(".nav-button")
  navButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (this.href === "#" || this.href === window.location.href) {
        e.preventDefault()
        alert("Bài viết khác sẽ sớm có sẵn.")
      }
    })
  })
})
