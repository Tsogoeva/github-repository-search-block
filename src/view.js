import onChange from 'on-change';

const createBlock = () => {
	const ulList = document.createElement('ul');
	ulList.classList.add('search__list');

	return ulList;
}

const createFeed = (feed) => {
	const {
		name,
		language,
		ownerAvatar,
		link,
		ownerLogin,
		ownerId,
		id,
	} = feed;

	const liItem = document.createElement('li');
	liItem.classList.add('search__list_item');
	liItem.dataset.id = id;

	const divInfo = document.createElement('div');
	divInfo.classList.add('search__list_item_info');

	const aLink = document.createElement('a');
	aLink.classList.add('search__item_title');
	aLink.setAttribute('target', '_blank');
	aLink.setAttribute('href', link);
	aLink.textContent = name;

	const pLanguage = document.createElement('p');
	pLanguage.classList.add('search__item_language');
	pLanguage.textContent = language;

	const pLogin = document.createElement('p');
	pLogin.classList.add('search__item_login');
	pLogin.textContent = ownerLogin;

	const pId = document.createElement('p');
	pId.classList.add('search__item_id');
	pId.textContent = ownerId;

	divInfo.append(aLink, pLanguage, pLogin, pId);

	const imgAvatar = document.createElement('img');
	imgAvatar.classList.add('search__item_avatar');
	imgAvatar.setAttribute('src', ownerAvatar);
	imgAvatar.setAttribute('alt', 'Avatar');


	liItem.append(divInfo, imgAvatar);
	return liItem;
}

const renderData = (feeds, container) => {
	container.innerHTML = '';

	const feedContainer = createBlock();

	feeds.forEach((feed) => {
		const builtFeed = createFeed(feed);
		feedContainer.prepend(builtFeed);
	});

	container.append(feedContainer);
}

export default (elements, state) => onChange(state, (path, value) => {
	const {
		form,
		field,
		submit,
		listContainer,
		blockFeeds,
		invalidNotice,
		notFound,
		loading,
		error,
	} = elements;

	const { feeds } = state;

	switch (path) {
		case 'process': {
			switch (value) {
				case 'receiving':
					listContainer.style.display = 'none';
					notFound.style.display = 'none';
					error.style.display = 'none';
					loading.style.display = 'block';
					submit.setAttribute('disabled', '');
					field.setAttribute('readonly', '');
					break;

				case 'received':
					loading.style.display = 'none';
					listContainer.style.display = 'block';
					submit.removeAttribute('disabled');
					field.removeAttribute('readonly');
					form.reset();
					field.focus();
					renderData(feeds, blockFeeds);
					break;

				case 'failed':
					loading.style.display = 'none';
					error.style.display = 'block';
					submit.removeAttribute('disabled');
					field.removeAttribute('readonly');
					break;

				case 'notFound':
					loading.style.display = 'none';
					notFound.style.display = 'block';
					submit.removeAttribute('disabled');
					field.removeAttribute('readonly');
					break;

				case 'invalid':
					field.classList.add('invalid');
					field.blur();
					invalidNotice.style.display = 'block';
					break;

				case 'focus':
					field.classList.remove('invalid');
					invalidNotice.style.display = 'none';
					break;

				default:
					throw new Error('Unknown process!');
			}
			break;
		}

		default:
			throw new Error('Unknown state');
	}
})
