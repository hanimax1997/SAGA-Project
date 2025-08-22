import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from './authentification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root', // or specify a module where it is provided
  })
export class VersionCheckService {
    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
    constructor(private _snackBar: MatSnackBar,private authentificationService:AuthentificationService,private http: HttpClient) { }
    /**
    * Checks in every set frequency the version of frontend application
    * @param url
    * @param {number} frequency - in milliseconds, defaults to 30 minutes
    */
    public initVersionCheck(url: any, frequency = 1000 * 30) {
        setInterval(() => {
      
            this.checkVersion(url);
        }, frequency);
        this.checkVersion(url);
    }
    /**
    * Will do the call and check if the hash has changed or not
    * @param url
    */
    private checkVersion(url: any) {
        // timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime())
            .subscribe(
                {
                    next: (response: any) => {
                        const hash = response.hash;
                
                        const hashChanged = this.hasHashChanged(this.currentHash, hash);
                        // If new version, do something
               
                        if (hashChanged) {
                            window.location.reload();
                            this.authentificationService.logout()
                            this._snackBar.open("Une nouvelle mise à jour a été déployé.", 'fermer', {
                                horizontalPosition: "end",
                                panelClass: ['info-snackbar'],
                                duration: 10000,
                              })
                            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
                            // for an example: location.reload();
                        }
                        // store the new hash so we wouldn't trigger versionChange again
                        // only necessary in case you did not force refresh
                        this.currentHash = hash;
                    },
                    error: (err) => {
                        console.error(err, 'Could not get version');
                    }
                }
            );
    }
    /**
    * Checks if hash has changed.
    * This file has the JS hash, if it is a different one than in the version.json
    * we are dealing with version change
    * @param currentHash
    * @param newHash
    * @returns {boolean}
    */
    private hasHashChanged(currentHash: any, newHash: any) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }
        return currentHash !== newHash;
    }
}