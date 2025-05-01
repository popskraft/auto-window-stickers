document.addEventListener('DOMContentLoaded', function () {
  // Get all FAQ titles within faqBody
  const faqTitles = document.querySelectorAll('#faqBody .style2');

  // Add click event listener to each title
  faqTitles.forEach(title => {
    title.addEventListener('click', function () {
      // Toggle active class on the title
      this.classList.toggle('active');

      // Get the next element (answer)
      const answer = this.nextElementSibling;

      // If it's not an answer (style6), skip it
      if (!answer.classList.contains('style6')) {
        return;
      }

      // Toggle active class on the answer
      answer.classList.toggle('active');
    });
  });
});

// const htmlElement = document.querySelector('html');

// function throttle(func, limit) {
//   let inThrottle;
//   return function () {
//     if (!inThrottle) {
//       func.apply(this, arguments);
//       inThrottle = true;
//       setTimeout(() => inThrottle = false, limit);
//     }
//   };
// }

// window.addEventListener('scroll', throttle(() => {
//   if (window.pageYOffset > 0) {
//     htmlElement.classList.add('scrolled');
//   } else {
//     htmlElement.classList.remove('scrolled');
//   }
// }, 200)); // Throttle scroll event to once every 200ms
