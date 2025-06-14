import {E2EComponentFixture} from "e2e/e2e-component.fixture";

export class QuizFixture extends E2EComponentFixture {
  async getTitleQuiz(index: number) {
    const allTitles = await this.getAllTitles();
    if (index >= allTitles.length) {
      throw new Error("Wrong Title Quiz Index");
    }
    return allTitles[index];
  }

  getButton(name: string) {
    return this.page.getByRole('button', {name: name});
  }

  clickButton(name: string) {
    return this.getButton(name).click();
  }

  getAllTitles() {
    return this.page.$$('app-quiz h2');
  }

  async getIndexOfTitle(quizName: string) {
    const titles = await this.getAllTitles();
    let indexOfCard = -1;
    for (let index = 0; index < titles.length; index++) {
      if ((await titles[index].textContent() ?? '').trim() == quizName.trim()) {
        indexOfCard = index;
      }
    }
    return indexOfCard;
  }

  async clickButtonOfQuiz(quizName: string, buttonName: string) {
    const buttonSelector = `button:has-text("${buttonName}")`;
    const buttons = await this.page.$$(buttonSelector);
    const indexOfCard = await this.getIndexOfTitle(quizName);

    if (indexOfCard >= buttons.length) {
      throw new Error(`Wrong Quiz Name`);
    }

    await buttons[indexOfCard].click();
  }
}
