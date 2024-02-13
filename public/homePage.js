"use strict";

const logoutButton = new LogoutButton();
logoutButton.action = function() {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    })
}

ApiConnector.current((response) => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

const ratesBoard = new RatesBoard();

function getNewStocks() {
	ApiConnector.getStocks((response) => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	})
}
getNewStocks();
setInterval(getNewStocks, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function(data) {
	ApiConnector.addMoney(data, ((response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, "Баланс пополнен");
		} else {
			moneyManager.setMessage(false, response.error);
		}
	}))
}

moneyManager.conversionMoneyCallback = function(data) {
	ApiConnector.convertMoney(data, ((response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, "Конвертация произведена");
		} else {
			moneyManager.setMessage(false, response.error);
		}
	}))
}

moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, response => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, "Перевод выполнен успешно");
      } else {
        moneyManager.setMessage(false, response.error);
      }
    });
};


const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
})

favoritesWidget.addUserCallback = function(data) {
	ApiConnector.addUserToFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь добавлен в избранное")
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	})
}

favoritesWidget.removeUserCallback = function(id) {
	ApiConnector.removeUserFromFavorites(id, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь удалён из избранного")
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	})
}