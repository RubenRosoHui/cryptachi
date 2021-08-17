<template>
	<button class="base-button" v-show="show" type="submit" id="g-recaptcha">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'RecaptchaButton',
		props: {
      show: {
        type: Boolean,
        required: false,
        default: true
      },
			type: {
				type: String,
				required: false,
				default: 'button'
			}
		},
		emits: {
      verify: (response) => {
        if (response)
          return true;
        else
          return false;
      },
      expire: null,
      fail: null
    },
    methods: {
      renderRecaptcha() {
				this.$nextTick(() => {
					this.recaptcha = window.grecaptcha.render('g-recaptcha', {
						'sitekey': process.env.VUE_APP_RECAPTCHA_SITEKEY,
						'size': 'invisible',
						'badge': 'inline',
						'callback': (response) => this.$emit("verify", response),
						'expired-callback': () => this.$emit("expire"),
						'error-callback': () => this.$emit("fail")
					});
				});
      },
      reset() {
        window.grecaptcha.reset(this.recaptcha);
      }
    },
		beforeMount() {
      if (window.grecaptcha == null) {
        new Promise((resolve) => {
          window.recaptchaReady = function () {
            resolve();
          };

          const doc = window.document;
          const scriptTag = doc.createElement('script');
          scriptTag.id = 'recaptcha-script';
          scriptTag.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=recaptchaReady&render=explicit');
          doc.head.appendChild(scriptTag);
        }).then(() => {
          this.renderRecaptcha();
        });
      }
      else {
        this.renderRecaptcha();
      }
    }
	};
</script>

<style>
	.grecaptcha-badge {
		position: fixed;
		top: 100%;
		right: 0;
	}
</style>
