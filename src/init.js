import render from './view.js';

const getId = () => Math.floor(Math.random() * 1000);

const eventHandlers = (view, state, elements) => {
	const { form, field } = elements;
	field.focus();

	function submitHandler(event) {
		event.preventDefault();

		state.feeds = [];

		const formData = new FormData(form);
		state.substringLink = formData.get('text');

		if (state.substringLink.length < 4 || state.substringLink.includes(' ')) {
			view.process = 'invalid';
		} else {
			view.process = 'receiving';

			fetch(('https://api.github.com/search/repositories' + `?q=${state.substringLink}`))
				.then((response) => response.json())
				.then(({ items }) => {
					const cutNumberOfItems = items.slice(0, 11);

					cutNumberOfItems.forEach(({ name, language, owner }) => {
						const data = {
							name,
							language,
							link: owner.html_url,
							ownerAvatar: owner.avatar_url,
							ownerId: owner.id,
							ownerLogin: owner.login,
							id: getId(),
						}

						state.feeds.push(data);
					})

					if (state.feeds.length === 0) {
						view.process = 'notFound';
					} else {
						view.process = 'received';
					}
				})
				.catch((error) => {
					view.process = 'failed';
					throw new Error(error.message);
				})
		}
	}


	form.addEventListener('submit', submitHandler);
	form.addEventListener('keyup', (event) => {
		if (event.code === 'Enter') {
			submitHandler(event);
		}
	})

	field.addEventListener('focus', () => {
		view.process = 'focus';
	})
}

export default function () {
	const elements = {
		form: document.querySelector('form'),
		field: document.querySelector('.search__field_input'),
		submit: document.querySelector('.search__field_button'),
		listContainer: document.querySelector('.search__container_list'),
		blockFeeds: document.querySelector('.search__block_list'),
		invalidNotice: document.querySelector('.search__field_invalid'),
		notFound: document.querySelector('.search__container_not_found'),
		loading: document.querySelector('.search__container_loading'),
		error: document.querySelector('.search__container_error'),
	}

	const state = {
		process: '', // receiving, received, failed, notFound, invalid, focus
		feeds: [],
		substringLink: '',
	}

	const view = render(elements, state);

	eventHandlers(view, state, elements);
}
