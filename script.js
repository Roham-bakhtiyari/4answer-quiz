const quizData = [
          {
              question: "پایتخت فرانسه چیست؟",
              a: { text: "پاریس", points: 5 },
              b: { text: "لندن", points: 4 },
              c: { text: "برلین", points: 3 },
              d: { text: "مادرید", points: 1 },
              correct: "a",
          },
          {
              question: "کدام سیاره به سیاره سرخ معروف است؟",
              a: { text: "زمین", points: 1 },
              b: { text: "مریخ", points: 5 },
              c: { text: "مشتری", points: 3 },
              d: { text: "زهره", points: 4 },
              correct: "b",
          },
          {
              question: "بزرگترین اقیانوس زمین چیست؟",
              a: { text: "اقیانوس اطلس", points: 3 },
              b: { text: "اقیانوس هند", points: 4 },
              c: { text: "اقیانوس قطبی", points: 1 },
              d: { text: "اقیانوس آرام", points: 5 },
              correct: "d",
          },
          {
              question: "کدام عنصر نماد شیمیایی 'O' دارد؟",
              a: { text: "طلایی", points: 1 },
              b: { text: "اکسیژن", points: 5 },
              c: { text: "اوزیم", points: 4 },
              d: { text: "آهن", points: 3 },
              correct: "b",
          },
      ];
      
      const quiz = document.getElementById("quiz");
      const submitBtn = document.getElementById("submit");
      const result = document.getElementById("result");
      
      let currentQuiz = 0;
      let score = 0;
      
      // تابع بارگذاری سوالات
      function loadQuiz() {
          deselectAnswers();
          const currentQuizData = quizData[currentQuiz];
      
          quiz.innerHTML = `
              <div class="question">${currentQuizData.question}</div>
              <ul class="answers">
                  <li data-answer="a">
                      <input type="radio" id="a" name="answer" value="a">
                      <label for="a">${currentQuizData.a.text}</label>
                  </li>
                  <li data-answer="b">
                      <input type="radio" id="b" name="answer" value="b">
                      <label for="b">${currentQuizData.b.text}</label>
                  </li>
                  <li data-answer="c">
                      <input type="radio" id="c" name="answer" value="c">
                      <label for="c">${currentQuizData.c.text}</label>
                  </li>
                  <li data-answer="d">
                      <input type="radio" id="d" name="answer" value="d">
                      <label for="d">${currentQuizData.d.text}</label>
                  </li>
              </ul>
          `;
      
          // اضافه کردن رویداد کلیک برای هر li
          const answerElements = document.querySelectorAll(".answers li");
          answerElements.forEach(elem => {
              elem.addEventListener("click", () => {
                  deselectAnswers(); // غیرفعال کردن انتخاب‌های قبلی
                  const radioInput = elem.querySelector("input");
                  radioInput.checked = true; // انتخاب کردن گزینه
              });
          });
      }
      
      // تابع غیر فعال کردن انتخاب‌های قبلی
      function deselectAnswers() {
          const answersEls = document.querySelectorAll("input[name='answer']");
          answersEls.forEach((answerEl) => {
              answerEl.checked = false; // تیک پاسخ‌ها را برداشتن
          });
      }
      
      // تابع دریافت پاسخ انتخاب شده
      function getSelected() {
          const answersEls = document.querySelectorAll("input[name='answer']");
          let answer;
          answersEls.forEach((answerEl) => {
              if (answerEl.checked) {
                  answer = answerEl.value; // اگر گزینه انتخاب شده باشد، مقدار آن را ذخیره کن
              }
          });
          return answer;
      }
      
      // رویداد کلیک بر روی دکمه ارسال
      submitBtn.addEventListener("click", () => {
          const answer = getSelected(); // دریافت پاسخ انتخاب شده
      
          if (answer) { // اگر جوابی انتخاب شده است
              const selectedOption = quizData[currentQuiz][answer]; // گزینه انتخابی
              score += selectedOption.points; // اضافه کردن امتیاز مربوط به انتخاب
      
              currentQuiz++;
              if (currentQuiz < quizData.length) {
                  loadQuiz(); // بارگذاری سوال بعدی
              } else {
                  // نمایش نتیجه
                  result.innerHTML = `شما ${score} از ${quizData.length * 5} امتیاز کسب کردید!`;
                  quiz.style.display = 'none'; // مخفی کردن بخش سوالات
                  submitBtn.style.display = 'none'; // مخفی کردن دکمه ارسال
              }
          }
      });
      
      // بارگذاری سوالات برای بار اول
      loadQuiz();