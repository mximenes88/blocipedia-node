module.exports = class ApplicationPolicy {

    constructor(user, record) {
      this.user = user;
      this.record = record;
    }
  
    _isStandard() {
      return this.user && this.user.role == "standard";
    }
  
    _isAdmin() {
      return this.user && this.user.role == "admin";
    }
  
    _isPremium() {
      return this.user && this.user.role == "premium";
    }
  
    new() {
      return this.user != null;
    }
  
    create() {
      return this.new();
    }
  
    show() {
      return true;
    }
  
    edit() {
      return this.new() &&
        this.record && (this._isAdmin() || this._isStandard());
    }
  
    update() {
      return this.edit();
    }
  
    destroy() {
      return this.update();
    }
  }
  