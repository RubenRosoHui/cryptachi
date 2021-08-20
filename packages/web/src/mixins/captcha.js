export default {
  data: () => ({
    captchaResponse: null
  }),
  methods: {
		onCaptchaVerify(response) {
      this.captchaResponse = response;
			this.$refs.captchaBtn.reset();
		},
		onCaptchaExpire() {
			this.captchaReset();
		},
		onCaptchaFail() {
			this.captchaReset();
		},
		captchaReset() {
			this.$refs.captchaBtn.reset();
		}
  }
}
